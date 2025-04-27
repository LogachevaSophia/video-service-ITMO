const express = require('express');
const { upload, delete: deletevideo, getAllItems } = require('../controllers/VideoController');
const router = express.Router();
const { authenticateToken } = require('../middleWare/authMiddleware')
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
 *                   example:
 *                     - Id: 1  # Добавлено поле Id в примере
 *                       Name: "Sample Video 1"
 *                       Link: "https://example.com/video1"
 *                       Preview: "https://example.com/preview1"
 *                       PersonId: 5
 *                       UserName: "JohnDoe"
 *                       Email: "john.doe@example.com"
 *                     - Id: 2  # Добавлено поле Id в примере
 *                       Name: "Sample Video 2"
 *                       Link: "https://example.com/video2"
 *                       Preview: "https://example.com/preview2"
 *                       PersonId: 123
 *                       UserName: "JaneDoe"
 *                       Email: "jane.doe@example.com"
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

module.exports = router;