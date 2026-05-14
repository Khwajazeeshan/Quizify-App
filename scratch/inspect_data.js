import clientPromise from '../lib/mongodb.js';

async function inspect() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const collections = ['questions', 'Islamiat', 'question', 'english'];
    for (const name of collections) {
      const doc = await db.collection(name).findOne({});
      console.log(`Collection: ${name}`);
      console.log(JSON.stringify(doc, null, 2));
      console.log('---');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

inspect();
