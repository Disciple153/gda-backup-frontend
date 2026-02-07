import type ConfigFieldProps from '../interfaces/ConfigFieldProps';
import React from 'react'
import TargetDirField from '../components/TargetDirField';
import CronField from '../components/CronField';
import CheckboxField from '../components/CheckboxField';
import FilterField from '../components/FilterField';

const CONFIG_FIELD_MAP: { [key: string]: React.ComponentType<ConfigFieldProps> } = {
  TARGET_DIR: TargetDirField,
  BACKUP_CRON: CronField,
  DRY_RUN: CheckboxField,
  FILTER: FilterField,
};

export default function ConfigField({ configKey, configMap, updateConfig }: ConfigFieldProps) {
  const isPassword = configKey.includes('PASSWORD') || configKey.includes('SECRET');

  const field = CONFIG_FIELD_MAP[configKey];
  if (field != undefined) {
    console.log(`field: ${field}`)
    return React.createElement(field, { configKey, configMap, updateConfig });
  }
  
  return (
    <input
      type={isPassword ? 'password' : 'text'}
      value={configMap[configKey]}
      onChange={(e) => updateConfig(configKey, e.target.value)}
      placeholder={`Enter ${configKey}`}
      spellCheck={false}
    />
  );
}
