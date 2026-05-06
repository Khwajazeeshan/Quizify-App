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
  const client = await clientPromise;
  const db = client.db();
  // Search for any document that has the requested topic in its questions object
  const query = {};
  query[`questions.${topic}`] = { $exists: true };
  
  const data = await db.collection('questions').findOne(query);
  const questions = data?.questions || {};
  return questions[topic] || [];
}

export default async function QuizPage({ params }) {
  const { topic } = await params;
  const topicQuestions = await getTopicQuestions(topic);

  return <QuizClient topic={topic} topicQuestions={topicQuestions} />;
}
