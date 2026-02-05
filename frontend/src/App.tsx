import { useState, useEffect } from 'react'
import './App.css'

interface EnvConfig {
  [key: string]: string;
}

const DEFAULT_CONFIG: EnvConfig = {
  BACKUP_CRON: '0 2 * * *',
  TARGET_DIR: '/backup',
  POSTGRES_PASSWORD: '',
  POSTGRES_HOST: 'database',
  POSTGRES_DB: 'postgres',
  POSTGRES_USER: 'postgres',
  BUCKET_NAME: '',
  DYNAMO_TABLE: '',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
  AWS_DEFAULT_REGION: 'us-east-1',
  LOG_LEVEL: 'info',
  DRY_RUN: 'false'
};

function App() {
  const [config, setConfig] = useState<EnvConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/env');
      if (response.ok) {
        const data = await response.json();
        setConfig({ ...DEFAULT_CONFIG, ...data });
        setError(null);
      } else {
        setError('Failed to load configuration');
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setError('API not available - using defaults');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        alert('Configuration saved successfully!');
      } else {
        setError('Failed to save configuration');
      }
    } catch (error) {
      setError('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      <h1>GDA Backup Configuration</h1>
      {error && <div className="error">{error}</div>}
      <div className="config-form">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="config-item">
            <label>{key}:</label>
            <input
              type={key.includes('PASSWORD') || key.includes('SECRET') ? 'password' : 'text'}
              value={value}
              onChange={(e) => updateConfig(key, e.target.value)}
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <button onClick={saveConfig} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}

export default App
