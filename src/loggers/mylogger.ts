import winston, { format } from "winston";
import {} from "winston-daily-rotate-file";
const { combine, timestamp, json, align, printf } = winston.format;

export interface LogParams {
    context: string;
    requestId: string;
    metadata?: Record<string, any>;
}

class MyLogger {
    logger: winston.Logger;

    constructor() {
        const formatPrint = printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp}:: ${level}::${context}::${requestId}::${message}::${JSON.stringify(
                    metadata
                )}`;
            }
        );

        this.logger = winston.createLogger({
            format: format.combine(
                timestamp({
                    format: "YYYY-MM-DD hh:mm:ss",
                }),
                formatPrint
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    dirname: "logs",
                    filename: "application-%DATE%.info.log",
                    datePattern: "YYYY-MM-DD-HH",
                    zippedArchive: true,
                    maxSize: "1m",
                    maxFiles: "14d",
                    level: "info",
                    format: format.combine(
                        timestamp({
                            format: "YYYY-MM-DD hh:mm:ss",
                        }),
                        formatPrint
                    ),
                }),
                new winston.transports.DailyRotateFile({
                    dirname: "logs",
                    filename: "application-%DATE%.error.log",
                    datePattern: "YYYY-MM-DD-HH",
                    zippedArchive: true,
                    maxSize: "1m",
                    maxFiles: "14d",
                    level: "error",
                    format: format.combine(
                        timestamp({
                            format: "YYYY-MM-DD hh:mm:ss",
                        }),
                        formatPrint
                    ),
                }),
            ],
        });
    }

    log(message: string, params: LogParams) {
        const logObject = Object.assign(
            {
                message,
            },
            params
        );

        this.logger.info(logObject);
    }

    error(message: string, params: LogParams) {
        const logObject = Object.assign(
            {
                message,
            },
            params
        );

        this.logger.error(logObject);
    }
}

export default new MyLogger();
