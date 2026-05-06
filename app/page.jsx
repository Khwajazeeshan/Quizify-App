import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import SearchTopics from './SearchTopics';

async function getQuestions() {
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
  
  return allQuestions;
}

export default async function Home() {
  const questions = await getQuestions();
  const topics = Object.keys(questions);

  const topicColors = {
    javascript: 'from-amber-400 to-orange-500',
    react: 'from-sky-400 to-blue-600',
    html: 'from-orange-500 to-red-600',
    nodejs: 'from-emerald-500 to-green-700',
    default: 'from-indigo-500 to-purple-600'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-10 md:pt-20 md:pb-16 px-4 md:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 blur-[100px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-4 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-700 text-[10px] md:text-xs font-black tracking-widest uppercase">
            Elevate Your Career
          </div>
          <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter leading-none text-slate-800">
            Quizify <span className="text-blue-600">Pro</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-xl text-slate-500 leading-relaxed font-medium px-2">
            The ultimate technical assessment platform. Master industry-leading technologies through curated, high-impact MCQ sessions.
          </p>
        </div>
      </div>

      {/* Dynamic Topics Section */}
      <SearchTopics topics={topics} questions={questions} topicColors={topicColors} />

      {/* Footer Branding */}
      <div className="max-w-6xl mx-auto px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">Q</div>
          <span className="font-black tracking-tight text-slate-800">Quizify.</span>
        </div>
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Professional Assessment Engine &bull; Version 1.0
        </div>
      </div>
    </div>
  );
}


