
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);
const url = require('url');
const path = require('path');

async function downloadFile(url, outputPath) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
    }

    await streamPipeline(response.body, fs.createWriteStream(outputPath));
    console.log('Download completed:', outputPath);
}

function getFileExtension(uri) {
    const pathname = url.parse(uri).pathname; // Extract the path part
    return path.extname(pathname); // Get the file extension
}

class TempFileStorage {
    constructor() { }

    async getTempDir() {
        const cwd = process.cwd();
        const tempDir = path.join(cwd, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        return tempDir;
    }

    async downloadVideo({ videoUrl, videoId }) {
        const tempDir = await this.getTempDir();
        const videoExtension = getFileExtension(videoUrl);
        const videoPath = path.join(tempDir, `${videoId}.${videoExtension}`);

        await downloadFile(videoUrl, videoPath);

        return videoPath;
    }

    async getAudioPath({ videoId }) {
        const tempDir = await this.getTempDir();
        const audioPath = path.join(tempDir, `${videoId}.wav`);

        return audioPath;
    }

    async getPreviewPath({ videoId }) {
        const tempDir = await this.getTempDir();
        const thumbnailPath = path.join(tempDir, `${videoId}.png`);

        return thumbnailPath;
    }
}

exports.TempFileStorage = TempFileStorage;