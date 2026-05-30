'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

// Fisher-Yates shuffle algorithm for unbiased randomization
function shuffleArray(array) {
  if (!array || !Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizClient({ topic, topicQuestions }) {
  const shuffledQuestions = useMemo(() => shuffleArray(topicQuestions), [topicQuestions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return shuffleArray(currentQuestion.options);
  }, [currentQuestion]);

  const handleAnswerClick = (option) => {
    if (answered) return;
    setSelectedAnswer(option);
    setAnswered(true);
    const isCorrect = option === currentQuestion.correct;
    if (isCorrect) setScore(score + 1);

    setUserAnswers([...userAnswers, {
      question: currentQuestion.question,
      selected: option,
      correct: currentQuestion.correct,
      isCorrect,
      explanation: currentQuestion.explanation || "No explanation provided."
    }]);
  };

  const handleNext = useCallback(() => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowScore(true);
    }
  }, [currentQuestionIndex, shuffledQuestions.length]);

  useEffect(() => {
    if (showScore || !currentQuestion) return;
    if (timeLeft === 0) {
      if (!answered) {
        setUserAnswers((prev) => [...prev, {
          question: currentQuestion.question,
          selected: "Timed Out",
          correct: currentQuestion.correct,
          isCorrect: false,
          explanation: "Time ran out."
        }]);
      }
      handleNext();
      return;
    }
    if (answered) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, answered, showScore, currentQuestion, handleNext]);

  if (!currentQuestion && !showScore) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Quiz Missing</h2>
          <p className="text-slate-400 mb-8">We couldn't find the questions for this topic.</p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl transition-all shadow-xl shadow-blue-900/20 inline-block font-bold">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (showScore) {
    const accuracy = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400 blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 text-center mb-8 border border-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-8 shadow-2xl rotate-3">
              {accuracy >= 80 ? '🏆' : '🔥'}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-2 text-slate-800 tracking-tighter">Quiz Complete!</h2>
            <p className="text-slate-500 font-medium mb-10 uppercase tracking-[0.2em] text-xs">Performance Summary</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Score</p>
                <p className="text-3xl font-black text-slate-800">{score}/{shuffledQuestions.length}</p>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Accuracy</p>
                <p className="text-3xl font-black text-blue-600">{accuracy}%</p>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 col-span-2 md:col-span-1">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Topic</p>
                <p className="text-3xl font-black text-slate-800 capitalize truncate px-2">{topic}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => window.location.reload()} className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-2xl transition-all font-black shadow-xl shadow-blue-200 text-sm active:scale-95">
                Try Again
              </button>
              <Link href="/" className="bg-slate-800 text-white hover:bg-slate-900 px-10 py-4 rounded-2xl transition-all font-black shadow-xl text-sm active:scale-95">
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 px-2 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
              Detailed Review
            </h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all hover:shadow-lg ${answer.isCorrect ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-lg ${answer.isCorrect ? 'bg-green-500 text-white shadow-green-200' : 'bg-red-500 text-white shadow-red-200'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold mb-6 text-slate-800 leading-tight">{answer.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-2xl border-2 ${answer.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                        <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Your Selection</span>
                        <p className={`text-sm font-black ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{answer.selected}</p>
                      </div>
                      {!answer.isCorrect && (
                        <div className="p-4 rounded-2xl border-2 bg-green-50/50 border-green-100">
                          <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Correct Path</span>
                          <p className="text-sm font-black text-green-600">{answer.correct}</p>
                        </div>
                      )}
                    </div>
                    {answer.explanation && (
                      <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed italic relative">
                        <span className="not-italic font-black text-slate-400 uppercase text-[9px] block mb-2 tracking-widest">Why this is correct</span>
                        {answer.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-2 md:p-4 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/40 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/40 blur-[120px] rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 bg-white/40 backdrop-blur-xl p-3 md:p-4 rounded-[1.5rem] border border-white/60 shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/" className="w-12 h-12 bg-white hover:bg-slate-50 rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm group">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black capitalize tracking-tight text-slate-800 leading-none mb-1">{topic}</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Technical Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex-1 md:flex-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Progress</span>
                <span className="text-xs font-black text-slate-800">{currentQuestionIndex + 1}/{shuffledQuestions.length}</span>
              </div>
              <div className="h-2 w-32 md:w-48 bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/50">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}></div>
              </div>
            </div>
            
            <div className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md shadow-lg ${timeLeft <= 10 ? 'border-red-500 bg-red-50 text-red-500 animate-pulse' : 'border-white bg-white text-blue-600'}`}>
              <span className="text-[9px] font-black uppercase leading-none mb-1">Sec</span>
              <span className="text-xl md:text-2xl font-black leading-none">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent"></div>
          
          <div className="flex justify-center mb-4">
            <div className="px-3 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100/50">
              Question Segment
            </div>
          </div>
          
          <h2 className="text-xl md:text-3xl font-black mb-6 md:mb-8 text-center leading-[1.1] text-slate-800 tracking-tight">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-2 mb-4 md:mb-6">
            {shuffledOptions.map((option, idx) => {
              let buttonStyle = "group relative p-2 md:p-4 rounded-2xl transition-all duration-300 text-left overflow-hidden border-2 flex items-center gap-4 ";
              
              if (!answered) {
                buttonStyle += "bg-slate-50/50 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-900/5 active:scale-[0.98] cursor-pointer";
              } else {
                if (option === currentQuestion.correct) {
                  buttonStyle += "bg-green-50 border-green-500 shadow-lg shadow-green-100 z-10";
                } else if (option === selectedAnswer) {
                  buttonStyle += "bg-red-50 border-red-500 shadow-lg shadow-red-100 z-10";
                } else {
                  buttonStyle += "bg-white border-slate-100 opacity-40 grayscale-[0.5]";
                }
              }

              return (
                <button key={idx} onClick={() => handleAnswerClick(option)} disabled={answered} className={buttonStyle}>
                  <span className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-sm md:text-lg font-black border-2 transition-all duration-300 shrink-0 ${answered ? (option === currentQuestion.correct ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : (option === selectedAnswer ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200' : 'bg-transparent border-slate-200 text-slate-300')) : 'bg-white border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold text-sm md:text-lg text-slate-700 leading-tight flex-1">{option}</span>
                  
                  {answered && option === currentQuestion.correct && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-300">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-4">
              {currentQuestion.explanation && (
                <div className="p-4 md:p-6 bg-blue-600 rounded-[1.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10"></div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2 opacity-80">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Detailed insight
                  </h4>
                  <p className="text-sm md:text-lg font-medium leading-relaxed italic">{currentQuestion.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-center">
                <button onClick={handleNext} className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl transition-all font-black text-sm md:text-lg shadow-2xl hover:shadow-slate-400 active:scale-95 group flex items-center gap-3">
                  {currentQuestionIndex + 1 === shuffledQuestions.length ? 'Finalize Result' : 'Next Question'}
                  <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Powered by Quizify Pro Intelligence</p>
        </div>
      </div>
    </div>
  );
}
