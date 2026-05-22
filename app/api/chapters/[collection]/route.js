import clientPromise from '@/lib/mongodb';

export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const { collection } = params;

    const client = await clientPromise;
    const db = client.db();
    const cursor = db.collection(collection).find({ questions: { $exists: true } });
    const allDocs = await cursor.toArray();
    
    const chapters = new Set();
    allDocs.forEach(doc => {
      if (doc.questions) {
        Object.keys(doc.questions).forEach(chapter => chapters.add(chapter));
      }
    });
    
    return Response.json({ 
      chapters: Array.from(chapters).sort() 
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return Response.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}
