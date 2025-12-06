import { MongoClient, ServerApiVersion } from 'mongodb';
import { seedProducts } from '../lib/seed-data';

export async function seedDatabase(existingClient?: MongoClient) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodscan';
  const client = existingClient || new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  });
  const shouldClose = !existingClient;

  try {
    if (!existingClient) {
      await client.connect();
      console.log('Connected to MongoDB');
    }

    const db = client.db('foodscan');
    const collection = db.collection('products');

    await collection.createIndex({ bar_code: 1 }, { unique: true });
    console.log('Created unique index on bar_code');

    for (const product of seedProducts) {
      await collection.updateOne(
        { bar_code: product.bar_code },
        { $set: product },
        { upsert: true }
      );
      console.log(`✓ Upserted product: ${product.product_name} (${product.bar_code})`);
    }

    console.log(`\n✅ Database seeded successfully!`);
    console.log(`Total products: ${seedProducts.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    if (shouldClose) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

if (require.main === module) {
  seedDatabase();
}
