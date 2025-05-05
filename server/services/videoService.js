const db = require('../db/connection');
const { createPresignedUrlWithClient } = require('../storage/s3');

class VideoService {
    constructor() { }

    async addVideo({ name, link, preview, cost = 100, authorId, }) {
        const [video] = await db.query('INSERT INTO video (Name, Link, Preview, Cost, Author) VALUES (?, ?, ?, ?, ?)', [name, link, preview, cost, authorId]);
        return video.insertId;
    }

    async setVideoChapters({ videoId, chapters }) {
        const connection = await db.getConnection(); // Получаем соединение для транзакции
        await connection.beginTransaction(); // Начинаем транзакцию

        try {
            const [video] = await connection.query('SELECT Id FROM video WHERE Id = ?', [videoId]);

            if (video.length === 0) {
                throw new Error('Video not found');
            }

            // Delete existing chapters for the video
            await connection.query('DELETE FROM video_chapter WHERE video_id = ?', [videoId]);

            for (const chapter of chapters) {
                await connection.query('INSERT INTO video_chapter (video_id, start_time, end_time, title, description) VALUES (?, ?, ?, ?, ?)', [videoId, chapter.startTimeMs, chapter.endTimeMs, chapter.title, chapter.description]);
            }

            await connection.commit();
        }
        catch (e) {
            await connection.rollback();
            throw new Error(`Failed to add video chapters: ${e.message}`);
        }
    }

    async setVideoPreview({ videoId, previewUrl }) {
        const [video] = await db.query('SELECT Id FROM video WHERE Id = ?', [videoId]);

        if (video.length === 0) {
            throw new Error('Video not found');
        }

        const result = await db.query('UPDATE video SET Preview = ? WHERE Id = ?', [previewUrl, videoId]);
        return result;
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
        const result = await db.query(`
            SELECT video.Id, video.Name, video.Link, video.Preview, PersonId, user.Name as UserName, Email, 
            video_chapter.id as chapter_id, video_chapter.start_time as chapter_start_time, video_chapter.end_time as chapter_end_time, video_chapter.title as chapter_title, video_chapter.description as chapter_description
            from video 
            LEFT JOIN user on user.PersonId=video.Author
            LEFT JOIN video_chapter on video.Id=video_chapter.video_id
            `);

        const rows = result[0];

        // Group by video ID
        const videosMap = new Map();

        for (const row of rows) {
            if (!videosMap.has(row.Id)) {
                videosMap.set(row.Id, {
                    Id: row.Id,
                    Name: row.Name,
                    Link: row.Link,
                    Preview: row.Preview,
                    PersonId: row.PersonId,
                    UserName: row.UserName,
                    Email: row.Email,
                    chapters: []
                });
            }

            if (row.chapter_id !== null) {
                videosMap.get(row.Id).chapters.push({
                    id: row.chapter_id,
                    title: row.chapter_title,
                    description: row.chapter_description,
                    start_time: row.chapter_start_time,
                    end_time: row.chapter_end_time,
                });
            }
        }

        const videos = Array.from(videosMap.values());

        console.log('Videos:', videos);

        const mappedVideos = await Promise.all(videos.map((video) => this.mapVideo(video)));

        return mappedVideos;
    }

    async mapVideo(video) {
        const { Link, ...rest } = video;

        const s3KeyPrefix = process.env.S3_KEY_PREFIX;
        const s3PreviewKeyPrefix = process.env.S3_PREVIEW_KEY_PREFIX;

        let url = Link
        let preview = video.Preview

        if (Link.startsWith(s3KeyPrefix)) {
            const presignedUrl = await createPresignedUrlWithClient({
                bucket: process.env.AWS_S3_BUCKET,
                key: Link,
            });
            url = presignedUrl;
        }

        if (preview && preview.startsWith(s3PreviewKeyPrefix)) {
            preview = await createPresignedUrlWithClient({
                bucket: process.env.AWS_S3_BUCKET,
                key: preview,
            });
        }

        return {
            ...rest,
            Link: url,
            Preview: preview,
        }
    }
}

const videoService = new VideoService();
exports.videoService = videoService;