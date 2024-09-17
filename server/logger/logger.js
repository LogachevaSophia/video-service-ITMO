const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Определение формата логов
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Создаем логгер
const logger = createLogger({
  format: combine(
    colorize(),             // Добавляем цвета для вывода в консоль
    timestamp(),            // Добавляем временную метку
    logFormat               // Применяем формат
  ),
  transports: [
    new transports.Console(), // Вывод в консоль
    new transports.File({ filename: 'combined.log' }) // Запись логов в файл
  ],
});

module.exports = logger;
