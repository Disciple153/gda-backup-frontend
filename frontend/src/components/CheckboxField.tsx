interface CheckboxFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CheckboxField({ value, onChange }: CheckboxFieldProps) {
  const isChecked = value === 'true';

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer'
      }}
    />
  );
}
