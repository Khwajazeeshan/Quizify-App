export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-100/50 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="flex flex-col items-center scale-100 md:scale-110">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200 animate-bounce">
            Q
          </div>
          {/* Ring effect */}
          <div className="absolute -inset-2 border-2 border-blue-600/20 rounded-[2rem] animate-ping"></div>
        </div>

        {/* Text Branding */}
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tighter text-slate-800 flex items-center gap-1.5">
            Quizify <span className="text-blue-600">Pro</span>
          </h2>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Version Tag */}
      <div className="absolute bottom-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 flex items-center gap-2">
        <span className="w-8 h-[1px] bg-slate-300"></span>
        Initializing Engine
        <span className="w-8 h-[1px] bg-slate-300"></span>
      </div>
    </div>
  );
}
