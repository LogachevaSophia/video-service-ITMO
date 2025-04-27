const db = require('../db/connection');
const logger = require('../logger/logger');
const path = require('path');
const { s3, createPresignedUrlWithClient, getBucketSize } = require('../storage/s3');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

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

exports.delete = async (req, res) => {
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
    try {
        const result = await db.query('Select Id, video.Name, Link, Preview, PersonId, user.Name as UserName, Email from video left join user on user.PersonId=video.Author');
        console.log(result);
        logger.info('successfully load all videos');
        const videos = await Promise.all(result[0].map(async (video) => {
            const { Link, ...rest } = video;

            const s3KeyPrefix = process.env.S3_KEY_PREFIX;
            let url = Link

            if (Link.startsWith(s3KeyPrefix)) {
                const presignedUrl = await createPresignedUrlWithClient({
                    bucket: process.env.AWS_S3_BUCKET,
                    key: Link,
                });
                url = presignedUrl;
            }

            return {
                ...rest,
                Link: url,
            }
        }))

        res.status(200).json({ data: videos })
    }
    catch (er) {
        logger.error('Failed to load all videos')
        res.status(500).json({ error: er.message })
    }

}

exports.uploadV2 = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const userId = req.user.id;

        const videoId = Date.now();

        const file = req.file;
        const extension = path.extname(file.originalname) || '.mp4'; // fallback to .mp4 if no extension
        const s3Key = `${process.env.S3_KEY_PREFIX}/${videoId}${extension}`;
        const fileSize = file.size;

        logger.info(`Uploading video: ${file.originalname}, size: ${fileSize} bytes`);

        // Check that storage is not full
        const bucketSize = await getBucketSize(process.env.AWS_S3_BUCKET);

        const maxSize = process.env.S3_MAX_SIZE_GB * 1024 * 1024 * 1024; // Convert GB to bytes

        if (bucketSize + fileSize >= maxSize) {
            return res.status(400).json({ message: 'Storage is full' });
        } else {
            logger.info(`Storage size: ${bucketSize} bytes`);
        }

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        logger.info(`Video uploaded to S3: ${s3Key}`);

        // Save video metadata to the database
        const [video] = await db.query('INSERT INTO video (Name, Link, Cost, Author) VALUES (?, ?, ?, ?)', [
            file.originalname,
            s3Key,
            100, // Assuming a default cost
            userId, // Assuming the user ID is available in req.user
        ]);

        logger.info(`Video metadata saved to database: ${video.insertId}`);

        // Here you would enqueue the video for background processing

        return res.status(200).json({
            message: 'Upload successful',
            videoId: video.insertId,
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
