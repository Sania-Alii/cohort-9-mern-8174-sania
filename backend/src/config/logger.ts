import pino from 'pino';

// Enterprise Security Standard: Sensitive data ko logs mein leak hone se bachana
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
    censor: '[*** MASKED ***]', // Sensitive info is text se replace ho jayegi
  },
  transport: {
    // Development environment mein logs ko readable aur colorize banane ke liye pino-pretty
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname', // Terminal ko clean rakhne ke liye extra info hide kar di hai
    },
  },
});

export default logger;