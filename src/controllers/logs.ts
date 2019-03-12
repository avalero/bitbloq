//import * as winston from 'winston'
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

const logger = createLogger({
    format: combine(
        label({ label: 'API' }),
        timestamp(), 
        format.splat(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/info.log', level: 'info' })
        //new winston.transports.Console()
    ]
});

const loggerController = {
    storeInfoLog: async (actionType, action, docType, user, others) => {
        logger.info('%s, %s, %s, %s, %s', actionType, action, docType, user, others);
    },

    storeErrorLog: async (actionType, action, docType, user, others) => {
        logger.error('%s, %s, %s, %s, %s', actionType, action, docType, user, others);
    }
};

export {logger, loggerController};