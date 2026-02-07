import { useState, useEffect } from 'react';
import ConfigField from '../components/ConfigField';
import TargetDirField from '../components/TargetDirField';
import CronField from '../components/CronField';
import CheckboxField from '../components/CheckboxField';
import FilterField from '../components/FilterField';
import type EnvConfig from '../interfaces/EnvConfig';
import type ConfigFieldProps from '../interfaces/ConfigFieldProps';

const CONFIG_ORDER: string[] = [
  'TARGET_DIR',
  'BACKUP_CRON',
  'FILTER',
  'DRY_RUN',
  'LOG_LEVEL',
  'DB_ENGINE',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_DB',
  'MIN_STORAGE_DURATION',
  'BUCKET_NAME',
  'DYNAMO_TABLE',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_DEFAULT_REGION',
  'NTFY_URL',
  'NTFY_TOPIC',
  'NTFY_USERNAME',
  'NTFY_PASSWORD',
]

const DEFAULT_CONFIG: EnvConfig = {
  BACKUP_CRON: '0 2 * * *',
  TARGET_DIR: '/backup',
  FILTER: '',
  FILTER_DELIMITER: '',
  DRY_RUN: 'false',
  LOG_LEVEL: 'info',
  DB_ENGINE: 'postgres',
  POSTGRES_USER: 'postgres',
  POSTGRES_PASSWORD: '',
  POSTGRES_HOST: 'database',
  POSTGRES_DB: 'postgres',
  MIN_STORAGE_DURATION: '',
  BUCKET_NAME: '',
  DYNAMO_TABLE: '',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
  AWS_DEFAULT_REGION: 'us-east-1',
  NTFY_URL: '',
  NTFY_TOPIC: '',
  NTFY_USERNAME: '',
  NTFY_PASSWORD: ''
};

const TOOLTIPS: { [key: string]: string } = {
  TARGET_DIR: 'Directory to store backups',
  BACKUP_CRON: 'Cron expression for backup schedule',
  FILTER: 'Comma-separated list of databases to backup',
  DRY_RUN: 'Enable dry run mode',
  LOG_LEVEL: 'Logging level (debug, info, warn, error)',
  DB_ENGINE: 'Database engine (postgres, mysql)',
  POSTGRES_USER: 'PostgreSQL username',
  POSTGRES_PASSWORD: 'PostgreSQL password',
  POSTGRES_HOST: 'PostgreSQL host',
  POSTGRES_DB: 'PostgreSQL database name',
  MIN_STORAGE_DURATION: 'Minimum duration to keep backups (e.g., 7d, 30d)',
  BUCKET_NAME: 'S3 bucket name',
  DYNAMO_TABLE: 'DynamoDB table name',
  AWS_ACCESS_KEY_ID: 'AWS access key ID',
  AWS_SECRET_ACCESS_KEY: 'AWS secret access key',
  AWS_DEFAULT_REGION: 'AWS region',
  NTFY_URL: 'ntfy.sh URL',
  NTFY_TOPIC: 'ntfy.sh topic',
  NTFY_USERNAME: 'ntfy.sh username',
  NTFY_PASSWORD: 'ntfy.sh password',
};

const CONFIG_FIELD_MAP: { [key: string]: React.ComponentType<ConfigFieldProps> } = {
  TARGET_DIR: TargetDirField,
  BACKUP_CRON: CronField,
  DRY_RUN: CheckboxField,
  FILTER: FilterField,
};

export default function Settings() {
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
        const data: { [key: string]: string } = await response.json();
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
    <div>
      <h1>GDA Backup Configuration</h1>
      {error && <div className="error">{error}</div>}
      <div className="config-form">
        {CONFIG_ORDER
          .map((key) => (
          <div key={key} className="config-item">
            <label>{key}:</label>
            {/* <{CONFIG_FIELD_MAP[key]} fieldKey={key} value={config[key]} onChange={(v) => updateConfig(key, v)} /> */}
            <ConfigField configKey={key} configMap={config} updateConfig={updateConfig} />

            {/* {key === 'TARGET_DIR' ? (
              <TargetDirField value={config[key]} onChange={(v) => updateConfig(key, v)} />
            ) : key === 'BACKUP_CRON' ? (
              <CronField value={config[key]} onChange={(v) => updateConfig(key, v)} />
            ) : key === 'DRY_RUN' ? (
              <CheckboxField value={config[key]} onChange={(v) => updateConfig(key, v)} />
            ) : key === 'FILTER' ? (
              <FilterField 
                filterValue={config[key]} 
                delimiterValue={config.FILTER_DELIMITER || ''}
                onFilterChange={(v) => updateConfig(key, v)}
                onDelimiterChange={(v) => updateConfig('FILTER_DELIMITER', v)}
              />
            ) : (
              <ConfigField fieldKey={key} value={config[key]} onChange={(v) => updateConfig(key, v)} />
            )} */}
          </div>
        ))}
        <button onClick={saveConfig} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
