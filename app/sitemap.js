import clientPromise from '@/lib/mongodb';

export default async function sitemap() {
  const baseUrl = "https://quizify.app";

  // Fetch topics from MongoDB to generate dynamic URLs
  let topics = [];
  try {
    const client = await clientPromise;
    const db = client.db();
    const cursor = db.collection('questions').find({});
    const allDocs = await cursor.toArray();
    
    const allQuestions = {};
    allDocs.forEach(doc => {
      if (doc.questions) {
        Object.assign(allQuestions, doc.questions);
      }
    });
    topics = Object.keys(allQuestions);
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  const topicUrls = topics.map((topic) => ({
    url: `${baseUrl}/quiz/${topic}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...topicUrls,
  ];
}
