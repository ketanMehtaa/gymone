type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  data?: any;
}

export function debug(message: string, options: LogOptions = {}) {
  const { level = 'info', data } = options;
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (process.env.NODE_ENV !== 'production') {
    switch (level) {
      case 'error':
        console.error(logMessage);
        if (data) {
          console.error('Error details:', data);
          if (data instanceof Error) {
            console.error('Stack trace:', data.stack);
          }
        }
        break;
      case 'warn':
        console.warn(logMessage);
        if (data) console.warn('Warning details:', data);
        break;
      default:
        console.log(logMessage);
        if (data) console.log('Additional data:', data);
    }
  }
} 