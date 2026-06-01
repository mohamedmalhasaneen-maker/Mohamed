import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles, BookOpen, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTimerProps {
  onPomoComplete: () => void;
  studentName: string;
}

const STUDY_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function FocusTimer({ onPomoComplete, studentName }: FocusTimerProps) {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(STUDY_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = mode === 'study' ? STUDY_DURATION : BREAK_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    // Play sound if supported
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // AudioContext failed or blocked
    }

    if (mode === 'study') {
      onPomoComplete();
      setShowCelebration(true);
      // Switch to break mode
      setMode('break');
      setTimeLeft(BREAK_DURATION);
    } else {
      // Switch back to study mode
      setMode('study');
      setTimeLeft(STUDY_DURATION);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? STUDY_DURATION : BREAK_DURATION);
  };

  const switchMode = (newMode: 'study' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? STUDY_DURATION : BREAK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col items-center text-center relative overflow-hidden h-full justify-between" dir="rtl">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-50/10 via-transparent to-transparent pointer-events-none" />

      {/* Mode Switches */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-full max-w-sm relative z-10">
        <button
          onClick={() => switchMode('study')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${
            mode === 'study'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          جلسة مذاكرة (25د)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-sm ${
            mode === 'break'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Coffee className="w-4 h-4" />
          استراحة ذهن (5د)
        </button>
      </div>

      {/* Visual Circle Progress Area */}
      <div className="relative my-8 flex items-center justify-center">
        {/* Glow behind timer */}
        <div className={`absolute w-44 h-44 rounded-full filter blur-xl transition-all duration-1000 ${
          isRunning 
            ? (mode === 'study' ? 'bg-amber-400/20 scale-110' : 'bg-blue-400/20 scale-110') 
            : 'bg-transparent scale-100'
        }`} />

        {/* Circular SVG Progress */}
        <svg className="w-56 h-56 transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="96"
            className="stroke-slate-100 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="112"
            cy="112"
            r="96"
            className={`fill-none transition-all duration-300 ${
              mode === 'study' ? 'stroke-amber-500' : 'stroke-blue-500'
            }`}
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={(2 * Math.PI * 96) * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        {/* Time and Mode text overlay */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            key={timeLeft}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-4xl font-extrabold font-mono tracking-tight text-slate-800"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            {mode === 'study' ? 'محارب التركيز ⚡' : 'استراحة مستحقة ☕'}
          </span>
        </div>
      </div>

      {/* Focus Message Area */}
      <div className="w-full max-w-sm px-4 min-h-[48px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.p
              key="running"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-amber-600 font-bold text-sm bg-amber-50 py-2 px-4 rounded-full border border-amber-100 flex items-center gap-1.5"
            >
              <Timer className="w-4 h-4 animate-pulse text-amber-500" />
              ابعد عن الموبايل يا {studentName}.. مستقبلك بيتبني دلوقتي! 🚀
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-500 font-medium text-sm leading-relaxed"
            >
              {mode === 'study' 
                ? 'جاهز تنجز مهمتك الجاية بتركيز 100%؟ ابدأ العداد وورينا همتك!' 
                : 'خد نفس عميق، اشرب مية أو شاي، وارجع لي لما ترتاح علشان نكمل.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-6 w-full max-w-xs relative z-10">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${
            mode === 'study'
              ? 'bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              : 'bg-gradient-to-l from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              إيقاف مؤقت
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              ابدأ الآن
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all cursor-pointer border border-slate-200"
          title="إعادة التعيين"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Completion Dialog/Popup */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-amber-650/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white z-50 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-2xl font-bold font-display">وحش ثانوية حقيقي! 👊</h3>
              <p className="text-amber-100 text-sm leading-relaxed max-w-xs">
                خلصت 25 دقيقة من المذاكرة الكاملة بكل تركيز. فخور بيك يا {studentName}! ضفنا لك 10 نقاط طاقة في رصيدك.
              </p>
              <p className="text-xs bg-black/20 py-1.5 px-3 rounded-full inline-block">
                يلا خدلك 5 دقائق بريك سريع ☕
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="mt-2 py-3 px-6 bg-white text-amber-600 font-bold rounded-xl text-sm shadow hover:bg-slate-50 transition cursor-pointer w-full"
              >
                فهمت، يلا بينا للراحة!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
