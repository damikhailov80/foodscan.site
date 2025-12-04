import { MongoClient } from 'mongodb';
import { seedProducts } from '../lib/seed-data';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodscan';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('foodscan');
    const collection = db.collection('products');

    await collection.drop().catch(() => {
      console.log('Collection does not exist, creating new one...');
    });

    await db.createCollection('products');
    await collection.createIndex({ bar_code: 1 }, { unique: true });
    console.log('Created products collection with unique index on bar_code');

    const result = await collection.insertMany(seedProducts);
    console.log(`Successfully inserted ${result.insertedCount} products`);

    const allProducts = await collection.find({}).toArray();
    console.log('\nSeeded products:');
    allProducts.forEach((product) => {
      console.log(`- ${product.brand_name} ${product.product_name} (${product.bar_code})`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

seed();
