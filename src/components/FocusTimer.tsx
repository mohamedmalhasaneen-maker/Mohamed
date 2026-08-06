import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles, BookOpen, Coffee, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTimerProps {
  onPomoComplete: () => void;
  studentName: string;
  notificationsEnabled?: boolean;
}

export default function FocusTimer({ onPomoComplete, studentName, notificationsEnabled }: FocusTimerProps) {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [studyMinutes, setStudyMinutes] = useState(() => {
    const saved = localStorage.getItem('thanaweya_focus_study_minutes');
    return saved ? Number(saved) : 25;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    const saved = localStorage.getItem('thanaweya_focus_break_minutes');
    return saved ? Number(saved) : 5;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('thanaweya_focus_study_minutes');
    return (saved ? Number(saved) : 25) * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem('thanaweya_focus_study_minutes', String(studyMinutes));
  }, [studyMinutes]);

  useEffect(() => {
    localStorage.setItem('thanaweya_focus_break_minutes', String(breakMinutes));
  }, [breakMinutes]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = mode === 'study' ? studyMinutes * 60 : breakMinutes * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  // Update timeLeft when durations are changed (only if timer is not running)
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
    }
  }, [studyMinutes, breakMinutes, mode, isRunning]);

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

    // Trigger Browser Push Notification if configured
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if (mode === 'study') {
          new Notification('انتهت جلسة المذاكرة البطلة! 🎯⏱️', {
            body: `عاش يا بطل! أتممت ${studyMinutes} دقيقة تركيز متواصل. خذ بريك سريع الآن لمدة ${breakMinutes} دقائق! ☕`,
          });
        } else {
          new Notification('انتهى وقت الراحة! حان وقت الجد 💪🔥', {
            body: `انتهى بريك الـ ${breakMinutes} دقائق لتبدأ جلسة المذاكرة القادمة (${studyMinutes} دقيقة). رفيقك يثق بنجاحك! ✨`,
          });
        }
      } catch (err) {
        console.error('Failed to trigger browser notification:', err);
      }
    }

    if (mode === 'study') {
      onPomoComplete();
      setShowCelebration(true);
      // Switch to break mode
      setMode('break');
      setTimeLeft(breakMinutes * 60);
    } else {
      // Switch back to study mode
      setMode('study');
      setTimeLeft(studyMinutes * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
  };

  const switchMode = (newMode: 'study' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
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
          className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs ${
            mode === 'study'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          جلسة مذاكرة ({studyMinutes}د)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer text-xs ${
            mode === 'break'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          استراحة ذهن ({breakMinutes}د)
        </button>
      </div>

      {/* Visual Circle Progress Area */}
      <div className="relative my-6 flex items-center justify-center">
        {/* Glow behind timer */}
        <div className={`absolute w-40 h-40 rounded-full filter blur-xl transition-all duration-1000 ${
          isRunning 
            ? (mode === 'study' ? 'bg-amber-400/20 scale-110' : 'bg-blue-400/20 scale-110') 
            : 'bg-transparent scale-100'
        }`} />

        {/* Circular SVG Progress */}
        <svg className="w-52 h-52 transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="88"
            className="stroke-slate-100 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="104"
            cy="104"
            r="88"
            className={`fill-none transition-all duration-300 ${
              mode === 'study' ? 'stroke-amber-500' : 'stroke-blue-500'
            }`}
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={(2 * Math.PI * 88) * (1 - progress / 100)}
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
      <div className="w-full max-w-sm px-4 min-h-[44px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.p
              key="running"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-amber-600 font-bold text-xs bg-amber-50 py-1.5 px-3 rounded-full border border-amber-100 flex items-center gap-1.5"
            >
              <Timer className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              ابعد عن الموبايل يا {studentName}.. مستقبلك بيتبني دلوقتي! 🚀
            </motion.p>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-500 font-medium text-xs leading-relaxed"
            >
              {mode === 'study' 
                ? 'جاهز تنجز مهمتك الجاية بتركيز 100%؟ ابدأ العداد وورينا همتك!' 
                : 'خد نفس عميق، اشرب مية أو شاي، وارجع لي لما ترتاح علشان نكمل.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4 mt-4 w-full max-w-xs relative z-10">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-3 px-5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer text-sm ${
            mode === 'study'
              ? 'bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              : 'bg-gradient-to-l from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              إيقاف مؤقت
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              ابدأ الآن
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all cursor-pointer border border-slate-200"
          title="إعادة التعيين"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Duration Settings Slider/Buttons */}
      <div className="w-full max-w-sm mt-6 border-t border-slate-100 pt-4 relative z-10 text-right">
        <h4 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5 justify-center">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          تعديل وقت التركيز والراحة ⏱️
        </h4>
        
        {isRunning && (
          <p className="text-[10px] text-amber-600 bg-amber-50 py-1 px-3 rounded-lg border border-amber-100/50 mb-3 text-center font-bold animate-pulse">
            أوقف المؤقت أولاً لتتمكن من ضبط الأوقات! 🛑
          </p>
        )}

        <div className="space-y-3">
          {/* Study Minutes Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">وقت المذاكرة:</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={isRunning || studyMinutes <= 1}
                onClick={() => setStudyMinutes(m => Math.max(1, m - 1))}
                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 select-none cursor-pointer text-xs"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-extrabold text-xs text-slate-800 bg-white border border-slate-100 py-0.5 rounded">
                {studyMinutes} د
              </span>
              <button
                disabled={isRunning || studyMinutes >= 180}
                onClick={() => setStudyMinutes(m => Math.min(180, m + 1))}
                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 select-none cursor-pointer text-xs"
              >
                +
              </button>
            </div>
            
            {/* Quick study presets */}
            <div className="flex gap-1 shrink-0">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  disabled={isRunning}
                  onClick={() => setStudyMinutes(mins)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    studyMinutes === mins
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                  } disabled:opacity-50`}
                >
                  {mins}د
                </button>
              ))}
            </div>
          </div>

          {/* Break Minutes Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">وقت الراحة:</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={isRunning || breakMinutes <= 1}
                onClick={() => setBreakMinutes(m => Math.max(1, m - 1))}
                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 select-none cursor-pointer text-xs"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-extrabold text-xs text-slate-800 bg-white border border-slate-100 py-0.5 rounded">
                {breakMinutes} د
              </span>
              <button
                disabled={isRunning || breakMinutes >= 60}
                onClick={() => setBreakMinutes(m => Math.min(60, m + 1))}
                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 select-none cursor-pointer text-xs"
              >
                +
              </button>
            </div>

            {/* Quick break presets */}
            <div className="flex gap-1 shrink-0">
              {[3, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  disabled={isRunning}
                  onClick={() => setBreakMinutes(mins)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
                    breakMinutes === mins
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                  } disabled:opacity-50`}
                >
                  {mins}د
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Dialog/Popup */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-amber-600/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white z-50 text-center animate-fadeIn"
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
                خلصت جلسة مذاكرة كاملة بكل تركيز. فخور بيك يا {studentName}! ضفنا لك 15 نقطة طاقة إضافية في رصيدك.
              </p>
              <p className="text-xs bg-black/20 py-1.5 px-3 rounded-full inline-block">
                يلا خدلك {breakMinutes} دقائق بريك سريع ☕
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
