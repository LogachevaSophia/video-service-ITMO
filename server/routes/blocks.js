const express = require('express');
const { upload, ping } = require('../controllers/uploadBlockController');
const router = express.Router();
const {authenticateToken} = require('../middleWare/authMiddleware')

router.post('/upload', authenticateToken, upload);
router.get('/ping', authenticateToken, ping)


module.exports = router;
