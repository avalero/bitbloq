// import * as winston from 'winston'
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// import * as elasticsearch from 'winston-elasticsearch';
const Elasticsearch = require('winston-elasticsearch');

const myFormat = printf(({ level, timestamp, message }) => {
    return `${timestamp} ${level} ${message}`;
  });

const logger = createLogger({
    format: combine(
        timestamp(),
        format.splat(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/info.log', level: 'info' }),
        new Elasticsearch({ index: 'bitbloq-1-logs', level: 'info', ensureMappingTemplate: true }),
        // new winston.transports.Console()
    ]
});

const loggerController = {
    storeInfoLog: async (where, modelType, action, docType, user, others) => {
        logger.info('%s %s %s %s %s %s', where, modelType, action, docType, user, others);
    },

    storeErrorLog: async (modelType, action, docType, user, others) => {
        logger.error('%s %s %s %s %s', modelType, action, docType, user, others);
    }
};

export {logger, loggerController};