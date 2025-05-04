const { Session, waitForOperation } = require("@yandex-cloud/nodejs-sdk");
const { RecognizeFileRequest } = require("@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/ai/stt/v3/stt");
const { GetRecognitionRequest, AsyncRecognizerClient } = require("@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/ai/stt/v3/stt_service");
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const url = require('url');
const { createPresignedUrlWithClient, s3 } = require("../storage/s3");
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

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

class SpeechService {
    constructor() { }

    async getTextFromVideo({ videoUrl, videoId }) {
        const session = new Session({
            serviceAccountJson: {
                serviceAccountId: process.env.SERVICE_ACCOUNT_ID,
                accessKeyId: process.env.SERVICE_ACCOUNT_ACCESS_KEY_ID,
                privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
            }
        })

        console.log(`Started processing video: ${videoUrl}`);

        const audioUrl = await this.getAudioFromVideo({ videoUrl, videoId });

        const request = RecognizeFileRequest.fromPartial({
            uri: audioUrl,
            recognitionModel: {
                model: "general",
                audioFormat: {
                    containerAudio: {
                        containerAudioType: "WAV"
                    }
                },
                audioProcessingType: "FULL_DATA",
            },
        })

        const client = session.client(AsyncRecognizerClient);

        const operation = await client.recognizeFile(request);

        console.log(`Recognizing file... ${JSON.stringify(operation)}`);

        const operationResult = await waitForOperation(operation, session);

        if (operationResult.error) {
            throw new Error(`Error: ${operationResult.error.message}`);
        }

        console.log(`Recognition completed: ${JSON.stringify(operationResult)}`);

        let chunks = await this.waitForFinalResult({
            operationId: operationResult.id,
            client: client,
        })

        // Iterate through the chunks and merge the words

        let words = this.getWordsFromChunks(chunks);

        console.log('Words:', words);

        return words
    }

    async getAudioFromVideo({ videoUrl, videoId }) {
        // 1. Download the video file
        // 2. Extract the audio from the video file using ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav
        // 3. Upload the audio file to S3
        try {
            // Create temp directory if it doesn't exist
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Generate unique filenames
            const videoExtension = getFileExtension(videoUrl);

            const videoPath = path.join(tempDir, `${videoId}.${videoExtension}`);
            const audioPath = path.join(tempDir, `${videoId}.wav`);

            // 1. Download the video file
            console.log(`Downloading video from ${videoUrl}...`);
            await downloadFile(videoUrl, videoPath);

            // 2. Extract audio using ffmpeg
            console.log('Extracting audio from video...');
            execSync(`ffmpeg -i ${videoPath} -vn -acodec pcm_s16le -ar 44100 -ac 2 ${audioPath}`);

            // 3. Upload to S3
            console.log('Uploading audio to S3...');

            const fileContent = fs.readFileSync(audioPath);
            const s3Key = `audio/${videoId}.wav`;

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: s3Key,
                Body: fileContent,
                ContentType: 'audio/wav'
            };

            await s3.send(new PutObjectCommand(uploadParams));

            // Clean up temp files
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);

            // Return the S3 URL
            return createPresignedUrlWithClient(
                {
                    bucket: process.env.AWS_S3_BUCKET,
                    key: s3Key,
                }
            )
        } catch (error) {
            console.error('Error processing audio:', error);
            throw error;
        }

    }

    getWordsFromChunks(chunks) {
        let words = [];

        console.log(JSON.stringify(chunks));

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const alternative = chunk.alternatives[0];

            if (alternative.words) {
                words.push(...alternative.words);
            }
        }

        return words;
    }

    async getTextFromOperation({ operationId }) {
        const session = new Session({
            serviceAccountJson: {
                serviceAccountId: process.env.SERVICE_ACCOUNT_ID,
                accessKeyId: process.env.SERVICE_ACCOUNT_ACCESS_KEY_ID,
                privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
            }
        })

        const client = session.client(AsyncRecognizerClient);

        let chunks = await this.waitForFinalResult({
            operationId: operationId,
            client: client,
        })

        let words = this.getWordsFromChunks(chunks);

        console.log('Words:', words);

        return words
    }

    async waitForFinalResult({ operationId, client }) {
        let chunks = [];

        for (let i = 0; i < 10; i++) {
            chunks = []

            const getRecognition = GetRecognitionRequest.fromPartial({
                operationId: operationId,
            });

            const recognitionResult = client.getRecognition(getRecognition);

            for await (const value of recognitionResult) {
                console.log(JSON.stringify(value));

                if (value.final) {
                    chunks.push(value.final);

                    if (value.audioCursors && value.audioCursors.partialTimeMs == value.audioCursors.receivedDataMs) {
                        return chunks
                    }
                }
            }
            // sleep for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return lastValue;
    }
}

exports.SpeechService = SpeechService;