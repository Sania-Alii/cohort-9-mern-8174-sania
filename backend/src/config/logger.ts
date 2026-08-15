import pino from 'pino';

// hiding sensitive stuff from logs so it doesn't print in console
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
    censor: '***',
  },
  transport: {
    // formatting To read easily
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname', // hide extra info to keep terminal clean
    },
  },
});

export default logger;