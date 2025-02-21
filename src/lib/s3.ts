import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

// Debug log to check if env vars are loaded
console.log('S3 Environment Variables Present:', {
    endpoint: !!env.S3_ENDPOINT,
    region: !!env.S3_REGION,
    accessKey: !!env.S3_ACCESS_KEY,
    secretKey: !!env.S3_SECRET_KEY,
    bucketName: !!env.S3_BUCKET_NAME
});

if (!env.S3_REGION) {
    throw new Error('S3_REGION environment variable is required');
}

if (!env.S3_ENDPOINT) {
    throw new Error('S3_ENDPOINT environment variable is required');
}

if (!env.S3_ACCESS_KEY) {
    throw new Error('S3_ACCESS_KEY environment variable is required');
}

if (!env.S3_SECRET_KEY) {
    throw new Error('S3_SECRET_KEY environment variable is required');
}

if (!env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is required');
}

const s3Client = new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY
    },
    forcePathStyle: true
});

const BUCKET_NAME = env.S3_BUCKET_NAME;

export async function uploadToS3(directory: string, key: string, body: Buffer | string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${directory}/${key}`,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read'
    });
    
    await s3Client.send(command);

    const endpointDomain = env.S3_ENDPOINT.split('//')[1];
    
    return `https://${BUCKET_NAME}.${endpointDomain}/${directory}/${key}`;
}

export async function getSignedDownloadUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ResponseContentType: 'audio/mpeg',
        ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`
    });
    
    return getSignedUrl(s3Client, command, { expiresIn: 604800 });
} 