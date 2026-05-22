'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SectionPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [checkedChapters, setCheckedChapters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Unwrap the params promise
    Promise.resolve(paramsPromise).then(p => setParams(p));
  }, [paramsPromise]);

  useEffect(() => {
    if (!params?.collection) return;

    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/chapters/${params.collection}`);
        const data = await response.json();
        setChapters(data.chapters || []);

        // Load checked state from localStorage
        const saved = localStorage.getItem(`chapters-${params.collection}`);
        if (saved) {
          setCheckedChapters(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [params?.collection]);

  const handleCheckboxChange = (chapter) => {
    const updated = {
      ...checkedChapters,
      [chapter]: !checkedChapters[chapter]
    };
    setCheckedChapters(updated);
    localStorage.setItem(`chapters-${params.collection}`, JSON.stringify(updated));
  };

  if (!params || loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  const collection = params.collection;
  const displayName = collection === 'question' ? 'FIA' : 
                      collection === 'questions' ? 'General Knowledge' : 
                      collection.charAt(0).toUpperCase() + collection.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5 text-slate-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">Back to Sections</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">Q</div>
            <span className="font-black tracking-tight text-slate-800">Quizify.</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tight">
            {displayName} <span className="text-blue-600">Chapters</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Select a chapter to begin your practice session. Each chapter contains hand-picked MCQs.
          </p>
        </div>

        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter, index) => (
              <div key={chapter} className="group relative">
                <Link href={`/quiz/${collection}/${encodeURIComponent(chapter)}`} className="block">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {chapter}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                          Practice MCQs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCheckboxChange(chapter);
                  }}
                  className={`absolute top-5 right-5 w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                    checkedChapters[chapter]
                      ? 'bg-green-500 border-green-500'
                      : 'border-slate-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  {checkedChapters[chapter] && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">No chapters found</h3>
            <p className="text-slate-400">We couldn't find any questions for this section yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
