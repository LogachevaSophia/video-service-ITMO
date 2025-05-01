// queues/videoQueue.js
const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL);

const videoQueue = new Queue('video-processing', { connection });

module.exports = videoQueue;
