const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

// Middleware для проверки токена
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.warn('Access denied: No token provided');
    return res.status(403).json({ error: 'Access denied: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Access denied: Invalid token');
      return res.status(403).json({ error: 'Access denied: Invalid token' });
    }

    // Извлекаем данные пользователя из токена
    req.user = user;
    console.log(user)
    logger.info(`User authenticated: ${user.Email}, ${user.id}`);

    // Переходим к следующему middleware или роуту
    next();
  });
};
