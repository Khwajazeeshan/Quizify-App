'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchTopics({ topics, questions, topicColors }) {
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter(topic =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  const cardBgs = [
    'bg-blue-100 border-blue-200',
    'bg-emerald-100 border-emerald-200',
    'bg-amber-100 border-amber-200',
    'bg-rose-100 border-rose-200',
    'bg-indigo-100 border-indigo-200',
    'bg-violet-100 border-violet-200',
    'bg-cyan-100 border-cyan-200',
    'bg-orange-100 border-orange-200',
  ];

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-5 pb-10">


      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredTopics.map((topic, index) => (
            <Link key={topic} href={`/quiz/${topic}`} className="group relative">
              <div className={`h-full ${cardBgs[index % cardBgs.length]} border p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:bg-white group-hover:border-blue-200 relative overflow-hidden flex flex-col justify-between min-h-[100px] md:min-h-[160px]`}>
                <div className={`absolute -right-8 -bottom-8 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${topicColors[topic.toLowerCase()] || topicColors.default} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>

                <div>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${topicColors[topic.toLowerCase()] || topicColors.default} p-[2px] mb-2 md:mb-4 shadow-md shadow-slate-200`}>
                    <div className="w-full h-full bg-white rounded-[7px] md:rounded-[10px] flex items-center justify-center">
                      <span className="text-sm md:text-xl font-black uppercase leading-none text-slate-800">{topic[0]}</span>
                    </div>
                  </div>

                  <h3 className="text-sm md:text-lg font-black capitalize mb-1 tracking-tight group-hover:text-blue-600 transition-colors text-slate-800">
                    {topic.replace(/_/g, ' ')}
                  </h3>
                  <p className="hidden md:block text-[10px] text-slate-400 font-medium leading-tight mb-2 line-clamp-2">
                    Practice questions for {topic} mastery.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm md:text-xl font-black text-slate-800 leading-none">{questions[topic].length}</span>
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none mt-1">MCQs</span>
                  </div>

                  <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 border border-slate-100 group-hover:border-blue-600">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">No topics found</h3>
          <p className="text-slate-400">Try a different search term or check back later.</p>
        </div>
      )}
    </div>
  );
}
