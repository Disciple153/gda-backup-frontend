import type ConfigFieldProps from '../interfaces/ConfigFieldProps';

const CRON_PATTERNS = {
  minute: /^(\*|([0-5]?[0-9])(,([0-5]?[0-9]))*|\*\/([0-5]?[0-9])|([0-5]?[0-9])-([0-5]?[0-9]))$/,
  hour: /^(\*|([01]?[0-9]|2[0-3])(,([01]?[0-9]|2[0-3]))*|\*\/([01]?[0-9]|2[0-3])|([01]?[0-9]|2[0-3])-([01]?[0-9]|2[0-3]))$/,
  day: /^(\*|([1-9]|[12][0-9]|3[01])(,([1-9]|[12][0-9]|3[01]))*|\*\/([1-9]|[12][0-9]|3[01])|([1-9]|[12][0-9]|3[01])-([1-9]|[12][0-9]|3[01]))$/,
  month: /^(\*|(([1-9]|1[0-2])|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,(([1-9]|1[0-2])|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))*|\*\/(([1-9]|1[0-2])|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|(([1-9]|1[0-2])|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(([1-9]|1[0-2])|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))$/i,
  weekday: /^(\*|([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)(,([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT))*|\*\/([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)|([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)-([0-6]|SUN|MON|TUE|WED|THU|FRI|SAT))$/i
};

export default function CronField({ configKey, configMap, updateConfig }: ConfigFieldProps) {
  const value = configMap[configKey];
  const isSpecial = value.startsWith('@');
  const parts = isSpecial ? [] : value.split(' ');
  const [minute, hour, day, month, weekday] = parts.length === 5 ? parts : ['0', '2', '*', '*', '*'];

  const isValid = (val: string, pattern: RegExp) => pattern.test(val);

  const updatePart = (index: number, newValue: string) => {
    const newParts = [...parts];
    while (newParts.length < 5) newParts.push('*');
    newParts[index] = newValue;
    updateConfig(configKey, newParts.join(' '));
  };

  const inputStyle = (val: string, pattern: RegExp) => ({
    width: '80px',
    padding: '0.5rem',
    border: `1px solid ${isValid(val, pattern) ? '#444' : '#ff6b6b'}`,
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    textAlign: 'center' as const
  });

  if (isSpecial) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => updateConfig(configKey, e.target.value)}
        placeholder="@yearly, @monthly, @daily, etc."
        spellCheck={false}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: `1px solid ${/^@(yearly|annually|monthly|weekly|daily|hourly|reboot)$/.test(value) ? '#444' : '#ff6b6b'}`,
          borderRadius: '4px',
          fontSize: '1rem',
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0'
        }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={minute}
          onChange={(e) => updatePart(0, e.target.value)}
          placeholder="*"
          spellCheck={false}
          style={inputStyle(minute, CRON_PATTERNS.minute)}
        />
        <span style={{ fontSize: '0.75rem', color: '#888' }}>minute</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={hour}
          onChange={(e) => updatePart(1, e.target.value)}
          placeholder="*"
          spellCheck={false}
          style={inputStyle(hour, CRON_PATTERNS.hour)}
        />
        <span style={{ fontSize: '0.75rem', color: '#888' }}>hour</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={day}
          onChange={(e) => updatePart(2, e.target.value)}
          placeholder="*"
          spellCheck={false}
          style={inputStyle(day, CRON_PATTERNS.day)}
        />
        <span style={{ fontSize: '0.75rem', color: '#888' }}>day</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={month}
          onChange={(e) => updatePart(3, e.target.value)}
          placeholder="*"
          spellCheck={false}
          style={inputStyle(month, CRON_PATTERNS.month)}
        />
        <span style={{ fontSize: '0.75rem', color: '#888' }}>month</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={weekday}
          onChange={(e) => updatePart(4, e.target.value)}
          placeholder="*"
          spellCheck={false}
          style={inputStyle(weekday, CRON_PATTERNS.weekday)}
        />
        <span style={{ fontSize: '0.75rem', color: '#888' }}>weekday</span>
      </div>
    </div>
  );
}
