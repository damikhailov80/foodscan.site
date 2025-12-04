import { MongoClient } from 'mongodb';

const products = [
  {
    bar_code: '3017624010701',
    product_name: 'Nutella',
    brand_name: 'Ferrero',
    nutrition: {
      energy_kcal: 539,
      energy_kj: 2255,
      fat: 30.9,
      carbohydrates: 57.5,
      protein: 6.3,
      salt: 0.107,
    },
  },
  {
    bar_code: '5449000000996',
    product_name: 'Coca-Cola Original Taste',
    brand_name: 'Coca-Cola',
    nutrition: {
      energy_kcal: 42,
      energy_kj: 180,
      fat: 0,
      carbohydrates: 10.6,
      protein: 0,
      salt: 0,
    },
  },
  {
    bar_code: '3033490004545',
    product_name: 'Nature Yogurt',
    brand_name: 'Danone',
    nutrition: {
      energy_kcal: 74,
      energy_kj: 272,
      fat: 3.0,
      carbohydrates: 7.0,
      protein: 4.8,
      salt: 0.07,
    },
  },
];

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

    const result = await collection.insertMany(products);
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
