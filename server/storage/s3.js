const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

storage = new S3Client()

exports.s3 = storage;

exports.createPresignedUrlWithClient = ({ bucket, key }) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(storage, command, { expiresIn: 3600 * 24 });
};