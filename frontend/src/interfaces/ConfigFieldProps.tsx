import type EnvConfig from '../interfaces/EnvConfig';

export default interface ConfigFieldProps {
  configKey: string;
  configMap: EnvConfig;
  updateConfig: (key: string, value: string) => void;
}