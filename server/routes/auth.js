const express = require('express');
const { register, login, ping } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/ping', ping)


module.exports = router;
