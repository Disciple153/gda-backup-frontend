import type ConfigFieldProps from "../interfaces/ConfigFieldProps";

export default function CheckboxField({ configKey, configMap, updateConfig }: ConfigFieldProps) {
  const value = configMap[configKey];
  const isChecked = value === 'true';

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => updateConfig(configKey, e.target.checked ? 'true' : 'false')}
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer'
      }}
    />
  );
}
