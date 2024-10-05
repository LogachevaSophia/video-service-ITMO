const db = require('../db/connection');
const logger = require('../logger/logger');

exports.upload = async (req, res) => {
    const { Link, Name } = req.body;
    const userId = req.user.id;
    logger.info('Attemting to upload video by link');
    try {
        const [video] = await db.query('INSERT INTO video (Name, Link, Cost) VALUES (?, ?, ?)', [Name, Link, 100])
        res.status(201).json({ message: "Video uploaded", videoId: video.insertId })
    }
    catch (e) {
        logger.error(`Failed to upload video Link=${Link} at user=${userId}, error=${e.message}`)
        res.status(500).json({ error: `${e.message}` })
    }
}

exports.delete = async  (req, res) => {
    const { Id } = req.body;
    const userId = req.user.id;
    logger.info('Attemting to delete video by id');
    try {
        const result = await db.query('delete from  video where Id = ?', [Id])
        res.status(201).json({ message: "Video deleted" })
    }
    catch (e) {
        logger.error(`Failed to upload video Link=${Link} at user=${userId}, error=${e.message}`)
        res.status(500).json({ error: `${e.message}` })
    }
}

exports.getAllItems = async (req, res) => {
    logger.info('Attemting to get all videos');
    try{

        const result = await db.query('Select Name, Link from video');
        console.log(result);
        logger.info('successfully load all videos');
        res.status(200).json({data: result[0]})

    }
    catch(er){
        logger.error('Failed to load all videos')
        res.status(500).json({error: er.message})
    }

}