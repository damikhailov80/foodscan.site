import { CreateBucketCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { uploadFile, s3Client, BUCKET_NAME, getStorageBaseUrl } from '../lib/storage';

const TEST_IMAGES_DIR = path.join(process.cwd(), 'test-images', 'products');

async function ensureBucket() {
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✓ Created bucket: ${BUCKET_NAME}`);
  } catch (error: any) {
    if (error.name === 'BucketAlreadyOwnedByYou' || error.Code === 'BucketAlreadyOwnedByYou') {
      console.log(`✓ Bucket already exists: ${BUCKET_NAME}`);
    } else {
      throw error;
    }
  }
}

async function uploadImage(filePath: string, key: string) {
  try {
    const fileContent = fs.readFileSync(filePath);
    await uploadFile(key, fileContent, 'image/jpeg');
    console.log(`✓ Uploaded: ${key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to upload ${key}:`, error);
    return false;
  }
}

async function uploadTestImages() {
  console.log('Starting test images upload to MinIO...\n');

  await ensureBucket();

  if (!fs.existsSync(TEST_IMAGES_DIR)) {
    console.error(`\n✗ Test images directory not found: ${TEST_IMAGES_DIR}`);
    console.log('Run: npm run storage:download');
    process.exit(1);
  }

  const files = fs.readdirSync(TEST_IMAGES_DIR);
  
  if (files.length === 0) {
    console.error('\n✗ No images found in test-images/products/');
    console.log('Run: npm run storage:download');
    process.exit(1);
  }

  console.log(`\nFound ${files.length} files to upload:\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.jpeg')) {
      console.log(`⊘ Skipping non-JPEG file: ${file}`);
      continue;
    }

    const filePath = path.join(TEST_IMAGES_DIR, file);
    const key = `products/${file}`;
    
    const success = await uploadImage(filePath, key);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Upload complete!`);
  console.log(`Success: ${successCount} | Failed: ${failCount}`);
  console.log(`${'='.repeat(50)}\n`);

  console.log('Images are now available at:');
  console.log(`${getStorageBaseUrl()}/products/`);
  console.log('\nMinIO Console: http://localhost:9001');
  console.log('Login: minioadmin / minioadmin\n');
}

uploadTestImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

