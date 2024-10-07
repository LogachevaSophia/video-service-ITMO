const express = require('express');
const { getVideoFromRoom, createRoom } = require('../controllers/RoomController');
const router = express.Router();
const { authenticateToken } = require('../middleWare/authMiddleware')


/**
* @swagger
* /room/create:
*   post:
*     tags: [Room]
*     summary: Create new room
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: header
*         name: Authorization
*         schema:
*           type: string
*         required: true
*         description: Bearer token for authentication
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               videoId:
*                 type: number
*               videoLink:
*                 type: string
*             required:
*               - videoId
*               - videoLink
*     responses:
*       200:
*         description: Room created successfully  
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 roomId:
*                   type: string
*                   example: "roomId: '4d1978b1-14fd-4083-9f70-b640f7d56c5e'" 
*       400:
*         description: Error in body request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Video Id and videoLink are required"
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Internal server error" 
*/

router.post('/create', authenticateToken, createRoom);

/**
* @swagger
* /room/getVideo:
*   get:
*     tags: [Room]
*     summary: Get video by room Id
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: header
*         name: Authorization
*         schema:
*           type: string
*         required: true
*         description: Bearer token for authentication
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               roomId:
*                 type: string
*             required:
*               - roomId
*     responses:
*       200:
*         description: Room created successfully  
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 videoLink:
*                   type: string
*                   example: "dfv" 
*                 videoId:
*                   type: number
*                   example: 1 
*       400:
*         description: Error in body request
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Room Id is requiredd"
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Internal server error" 
*/

router.get('/getVideo', authenticateToken, getVideoFromRoom)


module.exports = router;
