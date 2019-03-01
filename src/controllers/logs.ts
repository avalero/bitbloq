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
        myFormat
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.File({ filename: './logs/combined.log' })
        //new winston.transports.Console()
    ]
});

export {logger};