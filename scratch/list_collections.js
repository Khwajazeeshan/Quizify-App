import clientPromise from '../lib/mongodb.js';

async function list() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

list();
