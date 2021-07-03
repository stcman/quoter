const winston = require('winston');
const { createLogger, format } = require('winston');
const { combine, timestamp, label, printf } = format;
const moment = require('moment');

const myFormat = printf(({ level, message, label }) => {
    return `[${moment().format("MM-DD-YYYY hh:mm:ss A")}] [${label}] [${level}] \n ${message} \n`;
});

const logger = createLogger({
    format: combine(
        label({ label: 'Similarity-Compare' }),
        timestamp(),
        myFormat
    ),
    transports: [new winston.transports.File({ filename: 'quoter.log' })]
});

module.exports = {logger};