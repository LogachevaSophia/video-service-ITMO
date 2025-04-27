const { S3Client, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

storage = new S3Client()

exports.s3 = storage;

exports.createPresignedUrlWithClient = ({ bucket, key }) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(storage, command, { expiresIn: 3600 * 24 });
};

exports.getBucketSize = async (bucketName) => {
    let size = 0;
    let continuationToken;

    do {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: continuationToken,
        });

        const response = await storage.send(command);

        if (response.Contents) {
            for (const obj of response.Contents) {
                size += obj.Size || 0; // Sum up the size of each object
            }
        }

        continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return size; // size is in bytes
}