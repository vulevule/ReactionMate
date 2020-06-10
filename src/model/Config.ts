
type ConfigType = 'simple' | 'recognition' | 'choice' | 'discrimination' | 'general';

export interface Config {
  type: ConfigType;
  minTimeout: number;
  maxTimeout: number;
  tries: number;
}
