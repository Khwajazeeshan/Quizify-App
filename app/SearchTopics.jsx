'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SearchTopics({ topics, questions, topicColors }) {
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter(topic => 
    topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <h2 className="text-sm md:text-xl font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span className="w-1 h-4 md:h-6 bg-blue-600 rounded-full"></span>
          Study Paths
        </h2>
        
        <div className="relative group w-full md:w-72">
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md"
          />
          <svg className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
          {filteredTopics.length} {filteredTopics.length === 1 ? 'Topic' : 'Topics'} Found
        </div>
      </div>

      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredTopics.map((topic) => (
            <Link key={topic} href={`/quiz/${topic}`} className="group relative">
              <div className="h-full bg-white border border-slate-200 p-6 md:p-8 rounded-2xl md:rounded-[2rem] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-blue-200 relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[200px]">
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br ${topicColors[topic.toLowerCase()] || topicColors.default} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                
                <div>
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${topicColors[topic.toLowerCase()] || topicColors.default} p-[2px] mb-4 md:mb-6 shadow-md shadow-slate-200`}>
                    <div className="w-full h-full bg-white rounded-[9px] md:rounded-[14px] flex items-center justify-center">
                      <span className="text-lg md:text-2xl font-black uppercase leading-none text-slate-800">{topic[0]}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-3xl font-black capitalize mb-1 md:mb-2 tracking-tight group-hover:text-blue-600 transition-colors text-slate-800">
                    {topic}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 font-medium leading-normal mb-4 line-clamp-2 md:line-clamp-none">
                    Practice questions for {topic} mastery.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg md:text-2xl font-black text-slate-800">{questions[topic].length}</span>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">MCQs</span>
                  </div>
                  
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 border border-slate-100 group-hover:border-blue-600">
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
