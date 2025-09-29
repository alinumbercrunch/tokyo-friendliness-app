// Simple structured logger for debugging
interface LogContext {
  error?: string;
  stack?: string;
  timestamp: string;
  [key: string]: unknown;
}

export const logger = {
  error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}`, {
      timestamp: new Date().toISOString(),
      ...context,
    });
  },
  
  info(message: string, context?: Record<string, unknown>) {
    console.log(`[INFO] ${message}`, {
      timestamp: new Date().toISOString(),
      ...context,
    });
  },
  
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, {
      timestamp: new Date().toISOString(),
      ...context,
    });
  }
};