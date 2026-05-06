'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

export default function QuizClient({ topic, topicQuestions }) {
  // Shuffle questions once on mount
  const shuffledQuestions = useMemo(() => {
    return [...topicQuestions].sort(() => Math.random() - 0.5);
  }, [topicQuestions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Shuffle options for the current question
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [...currentQuestion.options].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleAnswerClick = (option) => {
    if (answered) return;

    setSelectedAnswer(option);
    setAnswered(true);

    const isCorrect = option === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Store for review
    setUserAnswers([...userAnswers, {
      question: currentQuestion.question,
      selected: option,
      correct: currentQuestion.correct,
      isCorrect,
      explanation: currentQuestion.explanation || "No explanation provided for this question."
    }]);
  };

  const handleNext = useCallback(() => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(60);
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
          explanation: currentQuestion.explanation || "Time ran out before an answer was selected."
        }]);
      }
      handleNext();
      return;
    }

    if (answered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered, showScore, currentQuestion, handleNext]);

  if (!currentQuestion && !showScore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-[300px]">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-bold mb-4">Oops! Quiz Not Found</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all shadow-md inline-block font-semibold text-sm"
          >
            Explore Other Topics
          </Link>
        </div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-3 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-12 text-center mb-6 border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <h2 className="text-2xl md:text-5xl font-black mb-4 text-slate-800">Quiz Results</h2>
            
            <div className="flex justify-center items-baseline gap-1 mb-4">
              <span className="text-5xl md:text-7xl font-black text-blue-600">{score}</span>
              <span className="text-lg md:text-2xl text-slate-400 font-bold">/ {shuffledQuestions.length}</span>
            </div>

            <div className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-600 font-bold text-xs md:text-sm mb-6">
              {Math.round((score / shuffledQuestions.length) * 100)}% Accuracy
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl transition-all font-bold shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                Retake Quiz
              </button>
              <Link
                href="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl transition-all font-bold border border-slate-200 inline-block text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg md:text-2xl font-bold px-1 text-slate-700">Detailed Review</h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className={`p-4 rounded-xl border ${answer.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex gap-3">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm md:text-lg font-semibold mb-3 text-slate-800">{answer.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Your Answer</span>
                        <p className={`text-xs md:text-sm font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{answer.selected}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Correct Answer</span>
                        <p className="text-xs md:text-sm font-bold text-green-600">{answer.correct}</p>
                      </div>
                    </div>
                    {answer.explanation && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg text-[11px] md:text-xs text-slate-500 italic">
                        <span className="font-bold text-slate-600 not-italic mr-1">Note:</span>
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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div>
            <h1 className="text-xl md:text-3xl font-black capitalize tracking-tight mb-1 text-slate-800">{topic}</h1>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 md:w-32 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-700"
                  style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {currentQuestionIndex + 1} / {shuffledQuestions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 transition-all duration-300 ${timeLeft <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-blue-200 text-blue-600 bg-white'}`}>
              <span className="text-[8px] md:text-xs font-black uppercase leading-none mb-1">Time</span>
              <span className="text-sm md:text-xl font-black leading-none">{timeLeft}s</span>
            </div>
            <Link href="/" className="bg-white hover:bg-slate-50 p-2 md:p-3 rounded-xl transition-all border border-slate-200 group">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 border border-slate-200 shadow-xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
            Question
          </div>
          
          <h2 className="text-base md:text-2xl font-bold mb-8 md:mb-12 text-center leading-snug text-slate-800">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-12">
            {shuffledOptions.map((option, idx) => {
              let buttonClass = "group relative p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-200 text-left overflow-hidden border-2 ";
              
              if (!answered) {
                buttonClass += "bg-slate-50 border-slate-100 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
              } else {
                if (option === currentQuestion.correct) {
                  buttonClass += "bg-green-50 border-green-500 shadow-sm";
                } else if (option === selectedAnswer) {
                  buttonClass += "bg-red-50 border-red-500 shadow-sm";
                } else {
                  buttonClass += "bg-slate-50 border-slate-100 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3 md:gap-4 relative z-10">
                    <span className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] md:text-sm font-black border-2 transition-all ${answered ? (option === currentQuestion.correct ? 'bg-green-500 border-green-500 text-white' : (option === selectedAnswer ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-slate-200 text-slate-400')) : 'bg-white border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-bold text-sm md:text-lg text-slate-700">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
              {currentQuestion.explanation && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Explanation
                  </h4>
                  <p className="text-slate-600 text-[11px] md:text-sm leading-relaxed italic">{currentQuestion.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all font-black text-sm md:text-lg shadow-lg group flex items-center gap-2"
                >
                  {currentQuestionIndex + 1 === shuffledQuestions.length ? 'Finish Quiz' : 'Next Question'}
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


