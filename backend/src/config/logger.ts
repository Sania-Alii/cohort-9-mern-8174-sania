import pino from 'pino';

// Security Standard
const redactedPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'body.password',
  'body.confirmPassword',
  'body.token',
  'body.newPassword'
];

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: redactedPaths,
    censor: '[*** MASKED ***]', // Sensitive info will be replaced with this text
  },
  transport: {
    // To make logs readable and colorize
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname', // hide extra info to keep terminal clean
    },
  },
});

export default logger;