const db = require('../db/connection');
const logger = require('../logger/logger');

exports.upload = async (req, res) => {
    const { Link, Name, Preview } = req.body;
    const userId = req.user.id;
    logger.info('Attemting to upload video by link');
    try {
        const [video] = await db.query('INSERT INTO video (Name, Link, Cost, Author, Preview) VALUES (?, ?, ?, ?, ?)', [Name, Link, 100, userId, Preview])
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
        logger.error(`Failed to delete video id=${Id} at user=${userId}, error=${e.message}`)
        res.status(500).json({ error: `${e.message}` })
    }
}

exports.getAllItems = async (req, res) => {
    logger.info('Attemting to get all videos');
    try{
        const result = await db.query('Select Id, video.Name, Link, Preview, PersonId, user.Name as UserName, Email from video left join user on User.PersonId=video.Author');
        console.log(result);
        logger.info('successfully load all videos');
        res.status(200).json({data: result[0]})

    }
    catch(er){
        logger.error('Failed to load all videos')
        res.status(500).json({error: er.message})
    }

}