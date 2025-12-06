import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isProduction = process.env.NODE_ENV === 'production';

const storageConfig = isProduction
  ? {
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    }
  : {
      endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      },
      forcePathStyle: true,
    };

const s3Client = new S3Client(storageConfig);

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'foodscan-products';

export function getStorageBaseUrl(): string {
  if (isProduction && process.env.R2_PUBLIC_DOMAIN) {
    return `https://${process.env.R2_PUBLIC_DOMAIN}`;
  }
  
  const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
  return `${endpoint}/${BUCKET_NAME}`;
}

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob,
  contentType?: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    
    return `${getStorageBaseUrl()}/${key}`;
  } catch (error) {
    console.error(`Failed to upload file ${key}:`, error);
    throw new Error(`Storage upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    if (isProduction && process.env.R2_PUBLIC_DOMAIN) {
      return `${getStorageBaseUrl()}/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error(`Failed to get file URL for ${key}:`, error);
    throw new Error(`Storage URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error(`Failed to delete file ${key}:`, error);
    throw new Error(`Storage deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateProductPhotoKey(barcode: string, type: 'front' | 'nutrition'): string {
  return `products/${barcode}/${type}.jpg`;
}

export { s3Client, BUCKET_NAME };

