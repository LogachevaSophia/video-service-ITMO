const dotenv = require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const { videoService } = require('../services/videoService');
const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const worker = new Worker('video-processing', async job => {
    const { videoId } = job.data;
    console.log(`Started processing video: ${videoId}`);;
    const video = await videoService.getVideoById(videoId);
    console.log(`Got video info: ${videoId} - ${video.Name} - ${video.Link}`);
}, { connection });
