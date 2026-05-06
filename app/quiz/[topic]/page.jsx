import clientPromise from '@/lib/mongodb';
import QuizClient from './QuizClient';

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  return {
    title: `${capitalizedTopic} Quiz`,
    description: `Test your knowledge with our comprehensive ${capitalizedTopic} MCQ quiz. Perfect for test preparation and technical assessment.`,
    openGraph: {
      title: `${capitalizedTopic} Quiz | Quizify`,
      description: `Practice ${capitalizedTopic} questions and ace your technical exams with Quizify.`,
    },
  };
}

async function getTopicQuestions(topic) {
  const decodedTopic = decodeURIComponent(topic);
  const client = await clientPromise;
  const db = client.db();
  
  // First, try a direct query for better performance
  const directQuery = {};
  directQuery[`questions.${decodedTopic}`] = { $exists: true };
  const directData = await db.collection('questions').findOne(directQuery);
  
  if (directData?.questions?.[decodedTopic]) {
    return directData.questions[decodedTopic];
  }

  // Fallback: Fetch all documents and search keys flexibly (e.g., spaces vs underscores, case-insensitivity)
  const cursor = db.collection('questions').find({ questions: { $exists: true } });
  const allDocs = await cursor.toArray();
  
  for (const doc of allDocs) {
    const questions = doc.questions || {};
    const keys = Object.keys(questions);
    
    // Find a key that matches decodedTopic regardless of case or underscore/space differences
    const matchingKey = keys.find(k => {
      const normalizedK = k.toLowerCase().replace(/[_\s]/g, '');
      const normalizedTopic = decodedTopic.toLowerCase().replace(/[_\s]/g, '');
      return normalizedK === normalizedTopic;
    });

    if (matchingKey) {
      return questions[matchingKey];
    }
  }
  
  return [];
}

export default async function QuizPage({ params }) {
  const { topic } = await params;
  const decodedTopic = decodeURIComponent(topic);
  const topicQuestions = await getTopicQuestions(decodedTopic);

  return <QuizClient topic={decodedTopic} topicQuestions={topicQuestions} />;
}
