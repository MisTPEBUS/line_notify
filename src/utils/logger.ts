import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, label, colorize } = format;

// 定義 log 格式
const logFormat = printf(({ level, message, timestamp, stack, label }) => {
  return `${timestamp} [${label}] [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'line_notify' }), // 加入標籤
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // 只使用控制台輸出，不寫入檔案
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

export default logger;
