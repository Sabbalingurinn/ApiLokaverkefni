export interface ILogger {
    info(message: string, ...meta: unknown[]): void;
    error(message: string, ...meta: unknown[]): void;
  }
  
  export class ConsoleLogger implements ILogger {
    info(message: string, ...meta: unknown[]) {
      console.log('[INFO]', message, ...meta);
    }
  
    error(message: string, ...meta: unknown[]) {
      console.error('[ERROR]', message, ...meta);
    }
  }
  