const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const logger = require('../logger/logger');

exports.register = async (req, res) => {
  const { Name, Password, Gender, LastName, SecondName, Email } = req.body;
  logger.info(`Attempting to register user: ${Email}`);

  try {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(Password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    logger.info(`Password hashed for user: ${Email}`);

    // Сохраняем пользователя в базе данных
    await db.query('INSERT INTO User (Name, Password, Email, LastName, SecondName, Gender) VALUES (?, ?, ?, ?, ?, 1)', [Name, hashedPassword, Email, LastName, SecondName]);
    logger.info(`User registered successfully: ${Email}`);

    res.status(201).json({ message: 'User registered successfully' });
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
    const [users] = await db.execute('SELECT * FROM User WHERE Email = ?', [Email]);

    if (users.length === 0) {
      logger.warn(`Login failed for user: ${Email} - Invalid credentials`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      logger.warn(`Login failed for user: ${Email} - Invalid credentials`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Создаем JWT токен
    const token = jwt.sign({ id: user.PersonId, Email: user.Email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    logger.info(`Login successful for user: ${Email}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Login error for user: ${Email}, Error: ${error.message}`);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};


exports.ping = async (req, res) => {
  logger.info('Ping request received');
  res.status(200).json({ message: "pong" });
};

