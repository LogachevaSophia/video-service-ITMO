const dotenv = require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const { videoService } = require('../services/videoService');
const { SpeechService } = require('../services/speechService');
const { LlmService } = require('../services/llmService');
const { PreviewService } = require('../services/previewService');
const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

const worker = new Worker('video-processing', async job => {
    try {
        const { videoId } = job.data;
        console.log(`Started processing video: ${videoId}`);;
        const video = await videoService.getVideoById(videoId);
        console.log(`[Video ${videoId}] Got video info:  - ${video.Name} - ${video.Link}`);

        const speechService = new SpeechService();
        const words = await speechService.getTextFromVideo({ videoUrl: video.Link, videoId });
        console.log(`[Video ${videoId}] Got words for video: ${JSON.stringify(words)}`);

        // Load the prompt template from file
        const template = fs.readFileSync('./resources/video_chapters_prompt.hbs', 'utf8');

        // Compile the template
        const compiled = Handlebars.compile(template);

        // Provide data
        const data = {
            text: JSON.stringify(words),
        };

        // Generate the final prompt
        const prompt = compiled(data);
        console.log(`[Video ${videoId}] Generated prompt: ${prompt}`);

        const llmService = new LlmService();

        const response = await llmService.prompt(prompt)
        console.log(`[Video ${videoId}] Got response from LLM: ${response}`);

        const responseJson = llmService.extractJsonFromLlmOutput(response);
        const chapters = responseJson.chapters;

        console.log(`[Video ${videoId}] Got chapters: ${JSON.stringify(chapters)}`);
        await videoService.setVideoChapters({ videoId, chapters })

        console.log(`[Video ${videoId}] Updated video chapters: ${JSON.stringify(chapters)}`);

        // Generate preview
        let previewService = new PreviewService();
        const previewUrl = await previewService.generatePreview({ videoUrl: video.Link, videoId });

        console.log(`[Video ${videoId}] Generated preview: ${previewUrl}`);
        await videoService.setVideoPreview({ videoId, previewUrl });

        console.log(`[Video ${videoId}] Updated video preview: ${previewUrl}`);
    } catch (e) {
        console.log(`[Video ${videoId}] Error processing video: ${e.message}`);
        throw e;
    }
}, { connection });
