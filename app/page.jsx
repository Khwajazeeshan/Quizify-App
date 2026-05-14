import Link from 'next/link';
import clientPromise from '@/lib/mongodb';

async function getSections() {
  const client = await clientPromise;
  const db = client.db();
  const collections = await db.listCollections().toArray();
  
  // Filter out system collections and handle the mapping
  const sections = collections
    .map(c => c.name)
    .filter(name => !['system.indexes', 'system.users'].includes(name))
    .map(name => {
      let displayName = name;
      if (name === 'question') displayName = 'FIA';
      else if (name === 'questions') displayName = 'General Knowledge';
      else displayName = name.charAt(0).toUpperCase() + name.slice(1);
      
      return {
        id: name,
        displayName: displayName,
        collection: name
      };
    });
    
  return sections;
}

export default async function Home() {
  const sections = await getSections();

  const sectionColors = {
    fia: 'from-blue-500 to-indigo-700',
    english: 'from-emerald-500 to-teal-700',
    questions: 'from-amber-500 to-orange-700',
    islamiat: 'from-purple-500 to-violet-700',
    math: 'from-rose-500 to-pink-700',
    science: 'from-cyan-500 to-blue-700',
    default: 'from-slate-500 to-slate-800'
  };

  const cardBgs = [
    'bg-blue-50 border-blue-100',
    'bg-emerald-50 border-emerald-100',
    'bg-amber-50 border-amber-100',
    'bg-rose-50 border-rose-100',
    'bg-indigo-50 border-indigo-100',
    'bg-violet-50 border-violet-100',
    'bg-cyan-50 border-cyan-100',
    'bg-orange-50 border-orange-100',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-10 md:pt-20 md:pb-12 px-4 md:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 blur-[100px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-8xl font-black mb-2 tracking-tighter leading-none text-slate-800">
            Quizify <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mt-4">
            Select a section to start your preparation with chapter-wise MCQs.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <Link key={section.id} href={`/section/${section.collection}`} className="group relative">
              <div className={`h-full ${cardBgs[index % cardBgs.length]} border-2 p-6 rounded-3xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:bg-white group-hover:border-blue-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]`}>
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${sectionColors[section.id.toLowerCase()] || sectionColors.default} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sectionColors[section.id.toLowerCase()] || sectionColors.default} p-[2px] mb-6 shadow-lg shadow-slate-200`}>
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl font-black text-slate-800 uppercase">
                      {section.displayName[0]}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-blue-600 transition-colors text-slate-800">
                    {section.displayName}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Explore comprehensive chapters and MCQs for {section.displayName}.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Preparation Mode</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 border border-slate-100 group-hover:border-blue-600 group-hover:shadow-lg">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-6xl mx-auto px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">Q</div>
          <span className="font-black tracking-tight text-slate-800">Quizify.</span>
        </div>
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Professional Assessment Engine &bull; Version 2.0
        </div>
      </div>
    </div>
  );
}


