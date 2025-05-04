const db = require('../db/connection');
const { createPresignedUrlWithClient } = require('../storage/s3');

class VideoService {
    constructor() { }

    async addVideo({ name, link, preview, cost = 100, authorId, }) {
        const [video] = await db.query('INSERT INTO video (Name, Link, Preview, Cost, Author) VALUES (?, ?, ?, ?, ?)', [name, link, preview, cost, authorId]);
        return video.insertId;
    }

    async setVideoChapters({ videoId, chapters }) {
        try {
            await db.beginTransaction();
            const [video] = await db.query('SELECT Id FROM video WHERE Id = ?', [videoId]);

            if (video.length === 0) {
                throw new Error('Video not found');
            }

            // Delete existing chapters for the video
            await db.query('DELETE FROM video_chapter WHERE video_id = ?', [videoId]);

            for (const chapter of chapters) {
                await db.query('INSERT INTO video_chapter (video_id, start_time, end_time, title, description) VALUES (?, ?, ?, ?)', [videoId, chapter.startTime, chapter.endTime, chapter.title, chapter.description]);
            }

            await db.commit();
        }
        catch (e) {
            await db.rollback();
            throw new Error(`Failed to add video chapters: ${e.message}`);
        }
    }

    async deleteVideo({ id }) {
        const result = await db.query('DELETE FROM video WHERE Id = ?', [id]);
        return result;
    }

    async getVideoById(id) {
        const result = await db.query('SELECT Id, Name, Link, Preview, Cost, Author FROM video WHERE Id = ?', [id]);
        if (result[0].length === 0) {
            throw new Error('Video not found');
        }
        const video = result[0][0];

        return this.mapVideo(video);
    }

    async getAllVideos() {
        const result = await db.query('Select Id, video.Name, Link, Preview, PersonId, user.Name as UserName, Email from video left join user on user.PersonId=video.Author');
        const videos = await Promise.all(result[0].map((video) => this.mapVideo(video)));

        return videos;
    }

    async mapVideo(video) {
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
    }
}

const videoService = new VideoService();
exports.videoService = videoService;