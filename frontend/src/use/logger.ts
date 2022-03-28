type LoggerLevel = 'info' | 'warn' | 'error';
type AppEnvironment = 'development' | 'production';

export default function useLogger(environment: AppEnvironment = 'development') {
  const styles = {
    base: ['color: #fff', 'background-color: #444', 'padding: 2px 4px', 'border-radius: 2px'],
    info: ['background-color: steelblue'],
    warn: ['color: #eee', 'background-color: red'],
    error: ['background-color: #ef0000'],
  };

  const log = (text: string, level: LoggerLevel) => {
    if (import.meta.env.MODE === environment || environment === 'production') {
      let style = styles.base.join(';') + ';';
      if (level) {
        style += styles[level].join(';');
      }
      console[level](`%c${text}`, style);
    }
  };

  return { log };
}
