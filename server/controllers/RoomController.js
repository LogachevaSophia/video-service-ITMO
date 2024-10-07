const logger = require("../logger/logger")
const { v4: uuidv4 } = require('uuid');
const rooms  = require('../rooms');

exports.createRoom = (req, res) => {
    try {
        const { videoId, videoLink } = req.body;
        if (!videoId || !videoLink) {
            return res.status(400).json({ message: 'Video Id  and videoLink is required' });
        }
        const roomId = uuidv4();
        rooms[`${roomId}`] = { videoId,videoLink };
        logger.info(`Created room ${roomId} with video ${videoId}`)
        res.status(200).json({roomId})

    }
    catch (err) {
        logger.error(`Error in creating room, err: ${err.message}`)
        res.status(500).json({message: err.message})
    }
}

exports.getVideoFromRoom = (req, res) => {
    try{
        const {roomId} = req.query;
        console.log(roomId)
        if (!roomId)
            return res.satus(400).json({message: 'Room Id is required'})
        if (!rooms[roomId])
            return res.status(400).json({message: 'Room does not exist'})
        const {videoLink, videoId} = rooms[roomId];
        if (videoId && videoLink){
            logger.info(`Send video link and Id by room ${roomId}`)
            return res.status(200).json({videoLink, videoId})
        }

        res.status(400).json({message: "Not full information"})
        logger.error("Not full information")

    
    }
    catch(err){
        res.status(500).json({message: err.message})
        logger.error(err.message)
    }
}