import { useState } from 'react';

interface TargetDirFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TargetDirField({ value, onChange }: TargetDirFieldProps) {
  const [directories, setDirectories] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchDirectories = async (path: string) => {
    try {
      const response = await fetch('/api/ls?path=' + encodeURIComponent(path));
      if (response.ok) {
        const data = await response.json();
        setDirectories(data.directories || []);
        setCurrentPath(path);
      } else {
        setDirectories([]);
      }
    } catch (error) {
      console.error('Error fetching directories:', error);
      setDirectories([]);
    }
  };

  const handleUpLevel = () => {
    const trimmed = value.replace(/\/+$/, '');
    const parentPath = trimmed.substring(0, trimmed.lastIndexOf('/')) || '/';
    const finalPath = parentPath === '/' ? '/' : parentPath + '/';
    onChange(finalPath);
    fetchDirectories(finalPath);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        type="button"
        onClick={handleUpLevel}
        style={{
          padding: '0.5rem',
          margin: 0,
          minWidth: 'auto',
          fontSize: '1.2rem',
          flexShrink: 0
        }}
        disabled={value === '/' || value.replace(/\/+$/, '') === ''}
      >
        ⬆️
      </button>
      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setShowDropdown(true);
            fetchDirectories(value.substring(0, value.lastIndexOf('/')) || '/');
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Enter TARGET_DIR"
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: '2.5rem',
            resize: 'vertical',
            padding: '0.5rem',
            border: '1px solid #444',
            borderRadius: '4px',
            fontSize: '1rem',
            backgroundColor: '#2d2d2d',
            color: '#e0e0e0',
            fontFamily: 'inherit'
          }}
          rows={1}
        />
        {showDropdown && directories.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#2d2d2d',
            border: '1px solid #444',
            zIndex: 1000
          }}>
            {directories.map(dir => (
              <div
                key={dir}
                onClick={() => {
                  const newPath = currentPath === '/' ? `/${dir}/` : `${currentPath}/${dir}/`;
                  onChange(newPath);
                  fetchDirectories(newPath);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444',
                  color: '#e0e0e0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d3d3d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                📁 {dir}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
