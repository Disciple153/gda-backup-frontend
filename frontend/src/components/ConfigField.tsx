interface ConfigFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ConfigField({ fieldKey, value, onChange }: ConfigFieldProps) {
  const isPassword = fieldKey.includes('PASSWORD') || fieldKey.includes('SECRET');
  
  return (
    <input
      type={isPassword ? 'password' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`Enter ${fieldKey}`}
      spellCheck={false}
    />
  );
}
