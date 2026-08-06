import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Brain, 
  Clock, 
  Sparkles, 
  Flame, 
  Coffee, 
  Zap, 
  Volume2, 
  VolumeX,
  ArrowRight,
  Target,
  Smile,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeepFocusViewProps {
  task: Task;
  onClose: () => void;
  onComplete: (id: string) => void;
  notificationsEnabled?: boolean;
}

export default function DeepFocusView({ 
  task, 
  onClose, 
  onComplete, 
  notificationsEnabled 
}: DeepFocusViewProps) {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Focus encouragement slogans
  const focusSlogans = [
    "صب كل تركيزك هنا يا بطل، العالم الخارجي يمكنه الانتظار! 🤫",
    "كل ثانية تفانٍ تقربك خطوة من كليتك وحلم عمرك 🎓",
    "أنت أقوى من أي تشتت، افتخر بنفسك وبسعيك الآن 🔥",
    "اكتب قصة نجاحك بكل دقيقة تركيز هادئة ومستمرة ✍️",
    "رفيقك يثق بقدرتك التامة ومستواك الأسطوري! 💪",
    "التعب يزول والنجاح والزغاريد في بيتك تبقى للأبد ✨"
  ];
  const [sloganIndex, setSloganIndex] = useState(0);

  // Rotate focus slogan every 40 seconds
  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % focusSlogans.length);
    }, 40000);
    return () => clearInterval(sloganInterval);
  }, []);

  // Update minutes when mode changes
  useEffect(() => {
    setIsActive(false);
    if (mode === 'study') {
      setMinutes(25);
      setSeconds(0);
    } else {
      setMinutes(5);
      setSeconds(0);
    }
  }, [mode]);

  // Timer interval logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer Finished!
            handleTimerComplete();
            clearInterval(interval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  // Synthesize beautiful notification chime (pure offline web audio synth)
  const playCompletedChime = () => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play major pentatonic melody (C5, E5, G5, C6) for cheerful success sound
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);

        gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.4);

        osc.start(ctx.currentTime + index * 0.15);
        osc.stop(ctx.currentTime + index * 0.15 + 0.5);
      });
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playCompletedChime();

    // Trigger Browser Push Notification if configured
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if (mode === 'study') {
          new Notification('انتهى مؤقت التركيز العميق! 🎯🔥', {
            body: `عاش يا بطل! أتممت جلسة التركيز على مهمتك بنجاح باهر. خذ استراحة الآن! ☕`,
          });
        } else {
          new Notification('انتهت الاستراحة! حان وقت التركيز 🧘‍♂️⚡', {
            body: `جاهز للجلسة القادمة لإنهاء المهمة؟ عد إلى وضع التركيز العميق بقوة وحماس!`,
          });
        }
      } catch (err) {
        console.error('Failed to trigger browser notification:', err);
      }
    }

    // Toggle mode
    setMode(prev => prev === 'study' ? 'break' : 'study');
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    // Resume audio context if suspended
    try {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (err) {}
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'study') {
      setMinutes(25);
      setSeconds(0);
    } else {
      setMinutes(5);
      setSeconds(0);
    }
  };

  const totalSeconds = mode === 'study' ? 25 * 60 : 5 * 60;
  const currentSecondsLeft = minutes * 60 + seconds;
  const percentage = totalSeconds > 0 ? ((totalSeconds - currentSecondsLeft) / totalSeconds) * 100 : 0;

  // Render format
  const doubleDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]" dir="rtl">
      {/* Background Ambience Ambient Circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[100px] -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[100px] -ml-16 -mb-16 pointer-events-none" />

      {/* Top action bar */}
      <div className="w-full flex items-center justify-between mb-8 z-10 border-b border-slate-800 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمهام اليومية</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-800/50">
            <Brain className="w-3.5 h-3.5 animate-pulse" />
            <span>وضع التركيز العميق</span>
          </span>
          <button 
            type="button"
            onClick={() => setIsMuted(!isMuted)} 
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-slate-300 cursor-pointer" 
            title={isMuted ? 'تفعيل تنبيه الصوت' : 'كتم تنبيه الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Focus Area */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center z-10 my-auto">
        
        {/* Left side: Task Details & Completion */}
        <div className="space-y-6 text-right flex flex-col justify-between h-full py-4">
          <div className="space-y-3">
            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-black tracking-wide uppercase">
              المهمة المستهدفة حالياً 🎯
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white leading-relaxed font-display">
              {task.title}
            </h2>
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl font-bold border border-slate-700/50">
                {task.subject}
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                <Flame className="w-3.5 h-3.5" />
                +{task.energyPoints} نقطة طاقة
              </span>
            </div>
          </div>

          {/* Prompt/Slogan */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/80 min-h-[70px] flex items-center">
            <p className="text-xs font-bold text-slate-300 leading-relaxed">
              {focusSlogans[sloganIndex]}
            </p>
          </div>

          {/* Quick complete */}
          <div>
            <button
              onClick={() => onComplete(task.id)}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5 font-black text-white" />
              <span>أنجزت هذه المهمة بالكامل! 🎉</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-bold">
              اضغط لتسجيل إنجازك فوراً وكسب {task.energyPoints} نقطة طاقة!
            </p>
          </div>
        </div>

        {/* Right side: Circular Pomodoro Timer */}
        <div className="flex flex-col items-center justify-center bg-slate-800/30 p-6 rounded-3xl border border-slate-800/50">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6 gap-1 w-full max-w-[200px]">
            <button
              onClick={() => setMode('study')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'study' 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>تركيز</span>
            </button>
            <button
              onClick={() => setMode('break')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'break' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-3 h-3" />
              <span>راحة</span>
            </button>
          </div>

          {/* Elegant Circular Timer */}
          <div className="relative w-44 h-44 md:w-48 md:h-48 flex items-center justify-center mb-6">
            <svg className="absolute w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                strokeWidth="6"
                stroke="rgba(30, 41, 59, 0.9)"
                fill="transparent"
              />
              {/* Foreground circle with dasharray */}
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                strokeWidth="7"
                stroke={mode === 'study' ? '#F59E0B' : '#4F46E5'}
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Time display */}
            <div className="text-center flex flex-col justify-center items-center select-none z-10 bg-slate-900/60 w-36 h-36 rounded-full border border-slate-800/80 shadow-inner">
              <span className="font-mono text-4xl md:text-5xl font-black text-white leading-none tracking-widest pl-1">
                {doubleDigit(minutes)}:{doubleDigit(seconds)}
              </span>
              <span className={`text-[10px] font-black mt-2 tracking-wide uppercase ${mode === 'study' ? 'text-amber-400 animate-pulse' : 'text-indigo-400 animate-pulse'}`}>
                {mode === 'study' ? 'جلسة مذاكرة ⏱️' : 'وقت الاستراحة ☕'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center items-center w-full">
            <button
              onClick={resetTimer}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition cursor-pointer border border-slate-700/60"
              title="إعادة ضبط المؤقت"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTimer}
              className={`p-4 rounded-2xl transition-all shadow-md transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : mode === 'study' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white font-black'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black">إيقاف المؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black">ابدأ التركيز</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Decorative Tips Bar at the bottom */}
      <div className="w-full mt-8 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between text-center sm:text-right gap-3 text-slate-400 select-none">
        <span className="text-[10px] font-semibold flex items-center justify-center gap-1">
          <Smile className="w-3.5 h-3.5 text-amber-500" />
          <span>المذاكرة الذكية تهزم المذاكرة الطويلة الكثيفة دائماً!</span>
        </span>
        <span className="text-[10px] font-mono tracking-wider">
          بومودورو رفيقك الذكي ⚡ 25 دقيقة تركيز كافية لصناعة الفارق!
        </span>
      </div>
    </div>
  );
}
