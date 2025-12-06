import * as fs from 'fs';
import * as path from 'path';

const TEST_IMAGES_DIR = path.join(process.cwd(), 'test-images', 'products');

const productImages = [
  {
    barcode: '1111',
    name: 'Nutella',
    images: {
      front: 'https://images.openfoodfacts.org/images/products/301/762/042/0009/front_fr.191.400.jpg',
      nutrition: 'https://images.openfoodfacts.org/images/products/301/762/042/0009/nutrition_fr.193.400.jpg',
    },
  },
  {
    barcode: '2222',
    name: 'Coca-Cola',
    images: {
      front: 'https://images.openfoodfacts.org/images/products/544/900/005/4227/front_en.406.400.jpg',
      nutrition: 'https://images.openfoodfacts.org/images/products/544/900/005/4227/nutrition_bg.174.400.jpg',
    },
  },
  {
    barcode: '3333',
    name: 'Danone Yogurt',
    images: {
      front: 'https://images.openfoodfacts.org/images/products/611/103/200/2888/front_fr.29.400.jpg',
      nutrition: 'https://images.openfoodfacts.org/images/products/303/349/114/7067/nutrition_fr.126.400.jpg',
    },
  },
];

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    console.log(`Downloading: ${path.basename(filepath)}...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    
    console.log(`✓ Downloaded: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${path.basename(filepath)}:`, error);
    return false;
  }
}

async function downloadAllImages() {
  console.log('Downloading test images from Open Food Facts...\n');
  
  if (!fs.existsSync(TEST_IMAGES_DIR)) {
    fs.mkdirSync(TEST_IMAGES_DIR, { recursive: true });
    console.log(`Created directory: ${TEST_IMAGES_DIR}\n`);
  }

  let successCount = 0;
  let failCount = 0;

  for (const product of productImages) {
    console.log(`\n${product.name}:`);
    
    const frontPath = path.join(TEST_IMAGES_DIR, `${product.barcode}-front.jpg`);
    const nutritionPath = path.join(TEST_IMAGES_DIR, `${product.barcode}-nutrition.jpg`);

    const frontSuccess = await downloadImage(product.images.front, frontPath);
    const nutritionSuccess = await downloadImage(product.images.nutrition, nutritionPath);

    if (frontSuccess) successCount++;
    else failCount++;
    
    if (nutritionSuccess) successCount++;
    else failCount++;
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Download complete!`);
  console.log(`Success: ${successCount} | Failed: ${failCount}`);
  console.log(`${'='.repeat(50)}\n`);

  if (successCount > 0) {
    console.log('Images saved to:', TEST_IMAGES_DIR);
    console.log('\nNext steps:');
    console.log('1. npm run storage:setup   # Start MinIO');
    console.log('2. npm run storage:upload  # Upload images to MinIO\n');
  }
}

downloadAllImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

