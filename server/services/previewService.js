const { TempFileStorage } = require('../storage/tempFileStorage');
const { createPresignedUrlWithClient, s3 } = require("../storage/s3");
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const { execSync } = require('child_process');

class PreviewService {
    constructor() {
    }

    async generatePreview({ videoUrl, videoId }) {
        let tempFileStorage = new TempFileStorage();

        const videoPath = await tempFileStorage.downloadVideo({ videoUrl, videoId });
        const thumbnailPath = await tempFileStorage.getPreviewPath({ videoId });

        execSync(`ffmpeg -ss 00:00:02 -i ${videoPath} -frames:v 1 -s 1280x720 ${thumbnailPath}`);

        // Upload thumbnail to S3
        const fileContent = fs.readFileSync(thumbnailPath);
        const s3Key = `preview/${videoId}.png`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'image/png'
        };
        await s3.send(new PutObjectCommand(uploadParams));

        // Clean up temp files
        fs.unlinkSync(videoPath);
        fs.unlinkSync(thumbnailPath);

        // Return the S3 URL
        return s3Key
    }
}

exports.PreviewService = PreviewService;