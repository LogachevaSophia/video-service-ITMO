const express = require('express');
const { upload, delete: deletevideo, getAllItems, uploadV2 } = require('../controllers/VideoController');
const router = express.Router();
const { authenticateToken } = require('../middleWare/authMiddleware')
const multer = require('multer');

const uploadOptions = multer({
    storage: multer.memoryStorage(), // Store file in memory
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
});

/**
 * @swagger
 * /video/upload:
 *   post:
 *     tags: [Video]
 *     summary: Upload a new video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Link:
 *                 type: string
 *               Preview:
 *                 type: string                 
 *             required:
 *               - Name
 *               - Link
 *               - Preview
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video uploaded"
 *                 videoId:
 *                   type: string
 *                   example: "123"
 *       500:
 *         description: An error occurred during uploading video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during uploading video"
 */

router.post('/upload', authenticateToken, upload);


/**
 * @swagger
 * /video/upload:
 *   delete:
 *     tags: [Video]
 *     summary: Delete a video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *             required:
 *               - Id
 *     responses:
 *       201:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Video deleted"
 *       500:
 *         description: An error occurred during uploading video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during deleting video"
 */

router.delete('/delete', authenticateToken, deletevideo);



/**
 * @swagger
 * /video/getAll:
 *   get:
 *     tags: [Video]
 *     summary: Get all videos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Id:
 *                         type: int
 *                       Name:
 *                         type: string
 *                       Link:
 *                         type: string
 *                       Preview:
 *                         type: string
 *                       PersonId:
 *                         type: int
 *                       UserName:
 *                         type: string
 *                       Email:  
 *                         type: string
 *                       profanity:
 *                          type: boolean
 *                   example:
 *                     - Id: 1  # Добавлено поле Id в примере
 *                       Name: "Sample Video 1"
 *                       Link: "https://example.com/video1"
 *                       Preview: "https://example.com/preview1"
 *                       PersonId: 5
 *                       UserName: "JohnDoe"
 *                       Email: "john.doe@example.com"
 *                       profanity: false
 *                     - Id: 2  # Добавлено поле Id в примере
 *                       Name: "Sample Video 2"
 *                       Link: "https://example.com/video2"
 *                       Preview: "https://example.com/preview2"
 *                       PersonId: 123
 *                       UserName: "JaneDoe"
 *                       Email: "jane.doe@example.com"
 *                       profanity: true
 *       500:
 *         description: An error occurred during fetching videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during fetching videos"
 */


router.get('/getAll', authenticateToken, getAllItems)

/**
 * @swagger
 * /video/v2/upload:
 *   post:
 *     tags: [Video]
 *     summary: Uploads a video file and starts processing
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to upload
 *     responses:
 *       200:
 *         description: Upload successful, processing started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload successful, processing started
 *                 videoId:
 *                   type: string
 *                   example: "a7b6c8de-8c41-4b23-91f7-18d20b8a8bfb"
 *       400:
 *         description: Bad request (e.g., no file uploaded)
 */
router.post('/v2/upload', authenticateToken, uploadOptions.single('video'), uploadV2)

module.exports = router;