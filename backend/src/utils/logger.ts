import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard', // time in reading format
      ignore: 'pid,hostname' // keep terminal logs simple 
    }
  }
});

export default logger;