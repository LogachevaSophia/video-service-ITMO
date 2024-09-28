// ./routes/auth.js
const express = require('express');
const {authenticateToken} = require('../middleWare/authMiddleware')
const { register, login, ping, check } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               Name:
 *                 type: string
 *               LastName:
 *                 type: string
 *               SecondName:
 *                  type: string
 *             required:
 *               - Email
 *               - Password
 *               - Name
 *               - LastName
 *               - SecondName
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: An error occurred during registration
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *             required:
 *               - Email
 *               - Password
 *     responses:
 *       200:
 *         description: {token}
 *       501:
 *         description: An error occurred during login
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/ping:
 *   get:
 *     tags: [Auth]
 *     summary: Check server status
 *     responses:
 *       200:
 *         description: pong
 */
router.get('/ping', ping);

/**
 * @swagger
 * /auth/check:
 *   get:
 *     tags: [Auth]
 *     summary: Check auth user
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 */
router.get('/check', authenticateToken, check)

module.exports = router;
