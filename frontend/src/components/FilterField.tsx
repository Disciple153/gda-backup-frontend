import { useEffect } from 'react';
import type ConfigFieldProps from '../interfaces/ConfigFieldProps';

export default function FilterField({ configKey: key, configMap: config, updateConfig }: ConfigFieldProps) {
  const delimiter_key = `${key}_DELIMITER`;

  const filterValue = config[key]
  const delimiterValue = config[delimiter_key]

  const delimiter = delimiterValue || 'DEL';
  const filters = filterValue ? filterValue.split(delimiter) : [''];
  const displayFilters = filters.every(f => f !== '') ? [...filters, ''] : filters;

  useEffect(() => {
    if (!delimiterValue) {
      updateConfig(delimiter_key, 'DEL');
    }
  }, []);

  const updateFilters = (newFilters: string[]) => {
    const nonEmpty = newFilters.filter(f => f !== '');
    updateConfig(key, nonEmpty.join(delimiter));
  };

  const generateDelimiter = (n: number): string => {
    if (n === 0) return 'DEL';
    let result = '';
    let num = n;
    while (num > 0) {
      result = String.fromCharCode(65 + ((num - 1) % 26)) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  const findUnusedDelimiter = (filters: string[]): string => {
    for (let i = 0; i < 1000; i++) {
      const candidate = generateDelimiter(i);
      if (!filters.some(f => f.includes(candidate))) {
        return candidate;
      }
    }
    return 'DEL';
  };

  const handleChange = (index: number, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = value;
    
    // Check if delimiter is in any filter
    if (newFilters.some(f => f.includes(delimiter))) {
      const newDelim = findUnusedDelimiter(newFilters);
      updateConfig(delimiter_key, newDelim);
      updateConfig(key, newFilters.filter(f => f !== '').join(newDelim));
      return;
    }

    updateFilters(newFilters);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {displayFilters.map((filter, index) => (
        <input
          key={index}
          type="text"
          value={filter}
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder="Enter regex pattern (e.g., \.log$)"
          spellCheck={false}
          style={{
            padding: '0.5rem',
            border: '1px solid #444',
            borderRadius: '4px',
            fontSize: '1rem',
            backgroundColor: '#2d2d2d',
            color: '#e0e0e0',
            fontFamily: 'monospace'
          }}
        />
      ))}
      <div style={{ fontSize: '0.85rem', color: '#888' }}>
        Delimiter: {delimiter}
      </div>
    </div>
  );
}
