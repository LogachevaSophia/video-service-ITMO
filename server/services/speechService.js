const { Session, waitForOperation } = require("@yandex-cloud/nodejs-sdk");
const { RecognizeFileRequest } = require("@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/ai/stt/v3/stt");
const { GetRecognitionRequest, AsyncRecognizerClient } = require("@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/ai/stt/v3/stt_service");
const fs = require('fs');
const { execSync } = require('child_process');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { createPresignedUrlWithClient, s3 } = require("../storage/s3");
const { TempFileStorage } = require('../storage/tempFileStorage');

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
                // languageRestriction: {
                //     restrictionType: "WHITELIST",
                //     languageCode: [
                //         'auto',
                //     ],
                // },
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

        let words = this.getWordsFromChunks(chunks).map((word) => {
            const { $type, ...wordWithoutType } = word;
            return wordWithoutType;
        });

        console.log('Words:', words);

        return words
    }

    async getAudioFromVideo({ videoUrl, videoId }) {
        let tempFileStorage = new TempFileStorage();

        // 1. Download the video file
        // 2. Extract the audio from the video file using ffmpeg -i video.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 output.wav
        // 3. Upload the audio file to S3
        try {
            // 1. Download the video file
            console.log(`Downloading video from ${videoUrl}...`);
            const videoPath = await tempFileStorage.downloadVideo({ videoUrl, videoId });

            // 2. Extract audio using ffmpeg
            console.log('Extracting audio from video...');
            const audioPath = await tempFileStorage.getAudioPath({ videoId });
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

        const getRecognition = GetRecognitionRequest.fromPartial({
            operationId: operationId,
        });

        const recognitionResult = client.getRecognition(getRecognition);

        for await (const value of recognitionResult) {
            console.log(JSON.stringify(value));

            if (value.final) {
                chunks.push(value.final);
            }
        }

        return chunks;
    }
}

exports.SpeechService = SpeechService;