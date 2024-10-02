const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const logger = require('../logger/logger');
const generateJwt = (PersonId, Email) => {
  return jwt.sign({
    id: PersonId,
    Email: Email
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.register = async (req, res) => {
  const { Name, Password, Gender, LastName, SecondName, Email } = req.body;
  logger.info(`Attempting to register user: ${Email}`);

  try {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(Password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    logger.info(`Password hashed for user: ${Email}`);

    // Сохраняем пользователя в базе данных
    const [user] = await db.query('INSERT INTO user (Password, Email, Name) VALUES (?, ?, ?)', [hashedPassword, Email, Name]);
    logger.info(`User registered successfully: ${Email}`);
    // Создаем JWT токен
    const token = generateJwt(user.PersonId, user.Email);

    logger.info(`Login successful for user: ${Email}`);
    res.status(201).json({ message: 'User registered successfully', token: token });
  } catch (error) {
    logger.error(`Registration error for user: ${Email}, Error: ${error.message}`);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
};


exports.login = async (req, res) => {
  const { Email, Password } = req.body;
  logger.info(`Attempting login for user: ${Email}`);

  try {
    // Проверяем, существует ли пользователь
    const [users] = await db.execute('SELECT * FROM user WHERE Email = ?', [Email]);

    if (users.length === 0) {
      logger.warn(`Login failed for user: ${Email} - Invalid credentials`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    logger.info(`User data from database: ${JSON.stringify(user)}`);

    // Проверяем пароль
    logger.info(`Checking password for user: ${Email}`);
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    logger.info(`Password check result for user: ${Email}: ${isPasswordValid}`);

    if (!isPasswordValid) {
      logger.warn(`Login failed for user: ${Email} - Invalid credentials`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Создаем JWT токен
    const token = generateJwt(user.PersonId, user.Email);
    logger.info(`Generated JWT for user: ${Email}: ${token}`);

    logger.info(`Login successful for user: ${Email}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error for user: ${Email}, Error: ${error.stack}`);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};



exports.ping = async (req, res) => {
  logger.info('Ping request received');
  res.status(200).json({ message: "pong" });
};

exports.check = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }
  // Декодируем токен без проверки подписи и срока действия
  const decoded = jwt.decode(token);

  if (!decoded) {
    return res.status(400).json({ message: 'Некорректный токен' });
  }

  // Генерация нового токена на основе id и email из декодированного токена
  const newToken = generateJwt(decoded.id, decoded.Email);

  // Отправляем новый токен в ответе
  res.status(200).json({ token: newToken })
  res.status(200).json({ token })
}

