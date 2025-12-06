import { MongoClient, ServerApiVersion } from 'mongodb';

async function cleanDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodscan';
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('foodscan');

    console.log('Dropping products collection...');
    try {
      await db.collection('products').drop();
      console.log('✓ Products collection dropped');
    } catch (error: any) {
      if (error.codeName === 'NamespaceNotFound') {
        console.log('Products collection does not exist, nothing to clean');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Database cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

cleanDatabase();

