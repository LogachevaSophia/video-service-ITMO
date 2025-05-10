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
        const previewPath = await tempFileStorage.getPreviewPath({ videoId });

        let previewCommand = `ffmpeg -ss 2 -i "${videoPath}" -frames:v 1 \
            -vf "thumbnail,
                scale=1280:720:force_original_aspect_ratio=decrease,
                pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
            -q:v 2 "${previewPath}"`;

        execSync(previewCommand);

        // Upload thumbnail to S3
        const fileContent = fs.readFileSync(previewPath);
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
        fs.unlinkSync(previewPath);

        // Return the S3 URL
        return s3Key
    }
}

exports.PreviewService = PreviewService;