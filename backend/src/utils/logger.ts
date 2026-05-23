import pino from 'pino';

const logger = pino({
  // Set logging depth based on environment
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  // Use pretty printing only when coding locally
  transport: process.env.NODE_ENV !== 'production' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard', // Adds human-readable timestamps
        }
      } 
    : undefined // Defaults to ultra-fast raw JSON in production
});

// (global as any).logger = pinoInstance;
// declare global {
//   var logger: pino.Logger;
// }
export default logger;