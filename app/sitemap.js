import clientPromise from '@/lib/mongodb';

export default async function sitemap() {
  const baseUrl = "https://quizify.app";

  let urls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    }
  ];

  try {
    const client = await clientPromise;
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const name = collection.name;
      if (['system.indexes', 'system.users'].includes(name)) continue;

      // Add section URL
      urls.push({
        url: `${baseUrl}/section/${name}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });

      // Add chapter URLs for this section
      const cursor = db.collection(name).find({ questions: { $exists: true } });
      const allDocs = await cursor.toArray();
      
      const chapters = new Set();
      allDocs.forEach(doc => {
        if (doc.questions) {
          Object.keys(doc.questions).forEach(chapter => chapters.add(chapter));
        }
      });

      chapters.forEach(chapter => {
        urls.push({
          url: `${baseUrl}/quiz/${name}/${encodeURIComponent(chapter)}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return urls;
}
