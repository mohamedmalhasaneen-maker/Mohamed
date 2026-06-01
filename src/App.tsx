/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  StudentProfile, 
  Task, 
  Message, 
  Badge, 
  StudyChallenge 
} from './types';
import { 
  SUBJECTS_BY_BRANCH, 
  INITIAL_BADGES, 
  INITIAL_CHALLENGES, 
  getRandomCelebration 
} from './data';
import Onboarding from './components/Onboarding';
import FocusTimer from './components/FocusTimer';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  Brain, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Award, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Send, 
  RefreshCw, 
  HeartHandshake, 
  User, 
  Lock,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- STATE ---
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [challenges, setChallenges] = useState<StudyChallenge[]>(INITIAL_CHALLENGES);
  const [ventMessages, setVentMessages] = useState<Message[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks' | 'timer' | 'vent' | 'badges'>('dashboard');
  
  // App UI states
  const [dailyQuote, setDailyQuote] = useState<{title: string, text: string, type: string} | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Task Form inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');

  // AI Vent inputs
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- LOCAL STORAGE EFFECTS ---
  useEffect(() => {
    // Load student stats and details
    const savedProfile = localStorage.getItem('thanaweya_profile');
    const savedTasks = localStorage.getItem('thanaweya_tasks');
    const savedPoints = localStorage.getItem('thanaweya_points');
    const savedBadges = localStorage.getItem('thanaweya_badges');
    const savedChallenges = localStorage.getItem('thanaweya_challenges');
    const savedChatHistory = localStorage.getItem('thanaweya_chat');

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
      }
    }
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {}
    }

    if (savedPoints) {
      setPoints(Number(savedPoints));
    }

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {}
    }

    if (savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch (e) {}
    }

    if (savedChatHistory) {
      try {
        setVentMessages(JSON.parse(savedChatHistory));
      } catch (e) {}
    }

    setIsLoadingProfile(false);
    fetchDailyQuote();
  }, []);

  // Sync back to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('thanaweya_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('thanaweya_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('thanaweya_points', String(points));
    checkBadgesProgress(points);
  }, [points]);

  useEffect(() => {
    localStorage.setItem('thanaweya_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('thanaweya_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('thanaweya_chat', JSON.stringify(ventMessages));
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ventMessages]);


  // --- FUNCTIONS & API CALLS ---
  const fetchDailyQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const res = await fetch('/api/daily-quote');
      if (res.ok) {
        const data = await res.json();
        setDailyQuote(data);
      }
    } catch (e) {
      console.error("Error loading quote", e);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const handleProfileComplete = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    // Add 10 quick points for signing up
    setPoints((prev) => prev + 15);
    // Add default initial greeting
    setVentMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `أهلاً بك يا بطل! أنا "رفيق الثانوية" الذكي. فنان في تبسيط الأمور، وفي ضهرك دايماً. لما تحس بضغط، توتر، أو مكسل ومحتاج فرفشة ودعم نفسي، اكتب لي هنا على طول وفضفض بقلبك، وهتلاقيني بسمعك بحب وبديك طاقة تكمل بيها طريقك للقمة! 🎯🌟`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const checkBadgesProgress = (currentPoints: number) => {
    setBadges((prevBadges) => 
      prevBadges.map((badge) => {
        if (!badge.unlockedAt && currentPoints >= badge.requiredPoints) {
          return {
            ...badge,
            unlockedAt: new Date().toLocaleDateString('ar-EG')
          };
        }
        return badge;
      })
    );
  };

  const updateChallengeCount = (category: 'pomodoro' | 'tasks' | 'vent', increment = 1) => {
    setChallenges((prevChallenges) => 
      prevChallenges.map((ch) => {
        if (ch.category === category && !ch.isClaimed) {
          const newCount = Math.min(ch.targetCount, ch.currentCount + increment);
          return {
            ...ch,
            currentCount: newCount
          };
        }
        return ch;
      })
    );
  };

  // Add a task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      subject: newTaskSubject || 'مادة عامة',
      isCompleted: false,
      energyPoints: 10,
      pomodoroCount: 0,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskSubject('');
  };

  // Toggle complete task
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) => 
      prevTasks.map((t) => {
        if (t.id === id) {
          const toggledState = !t.isCompleted;
          if (toggledState) {
            // Task has been marked as completed
            setPoints((pts) => pts + t.energyPoints);
            // Trigger customized Egyptian celebratory notification toast
            setCelebrationMsg(getRandomCelebration());
            updateChallengeCount('tasks');
          } else {
            // Un-complete task, subtract points safely
            setPoints((pts) => Math.max(0, pts - t.energyPoints));
          }
          return { ...t, isCompleted: toggledState };
        }
        return t;
      })
    );
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Finished a Pomodoro session
  const handlePomoComplete = () => {
    // Add 15 energy points
    setPoints((pts) => pts + 15);
    updateChallengeCount('pomodoro', 1);
    
    // Add a stats counter on the tasks if there's any active
    if (tasks.length > 0) {
      setTasks((prevTasks) => {
        // Increment pomodoro count on the first incomplete task
        let updated = false;
        return prevTasks.map((t) => {
          if (!t.isCompleted && !updated) {
            updated = true;
            return { ...t, pomodoroCount: t.pomodoroCount + 1 };
          }
          return t;
        });
      });
    }
  };

  // Claim a completed challenge reward
  const handleClaimChallenge = (challengeId: string, reward: number) => {
    setPoints((pts) => pts + reward);
    setChallenges((prev) => 
      prev.map((ch) => {
        if (ch.id === challengeId) {
          return { ...ch, isClaimed: true };
        }
        return ch;
      })
    );
    setCelebrationMsg(`عاش يا بطل! تم استلام ${reward} نقطة طاقة إضافية في حصالة أحلامك! 🏆✨`);
  };

  // Send a message to AI Mentor
  const handleSendVent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setVentMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    updateChallengeCount('vent', 1);

    try {
      const res = await fetch('/api/vent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          previousMessages: ventMessages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          studentProfile: profile
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: Message = {
          id: crypto.randomUUID(),
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setVentMessages((prev) => [...prev, modelMsg]);
      } else {
        throw new Error('فشل الرد الذكي المريح.');
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: 'يا بطل، حصل ضغط شبكة خفيف عندي بس أنا دايماً في ضهرك! خد نفس عميق بومودوروي وجرب تكلمني تاني، حلمك بطل كبير وهنوصله سوا! 💪✨',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setVentMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Switch student profile branch (allows simple resets or corrections)
  const handleResetProfile = () => {
    if (confirm('هل ترغب في تعديل بيانات الشعبة الدراسية والكلية التي تحلم بها؟')) {
      setProfile(null);
    }
  };

  // Clear Chat History
  const handleClearChat = () => {
    if (confirm('هل تود مسح ركن الفضفضة للبدء من جديد؟')) {
      setVentMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `أهلاً بك يا بطل! أنا "رفيق الثانوية" الذكي. فنان في تبسيط الأمور، وفي ضهرك دايماً. لما تحس بضغط، توتر، أو مكسل ومحتاج فرفشة ودعم نفسي، اكتب لي هنا على طول وفضفض بقلبك، وهتلاقيني بسمعك بحب وبديك طاقة تكمل بيها طريقك للقمة! 🎯🌟`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // --- RENDERS ---
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
          <span className="text-slate-600 font-bold font-sans">برجاء الانتظار، جاري تحضير رفيق الثانوية...</span>
        </div>
      </div>
    );
  }

  if (!profile || !profile.isConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 transition-all duration-350">
        <div className="w-full max-w-lg mx-auto text-center mb-8">
          <h1 className="text-4xl font-extrabold text-amber-600 font-display flex items-center justify-center gap-2">
            <span>بطل المذاكرة</span>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </h1>
          <p className="text-slate-500 mt-2 text-sm">رفيقك الروحي والذكي للتفوق وتجاوز ضغط امتحانات الثانوية العامة</p>
        </div>
        <Onboarding onComplete={handleProfileComplete} initialProfile={profile || undefined} />
      </div>
    );
  }

  // Active Subject List helper
  const availableSubjects = SUBJECTS_BY_BRANCH[profile.branch || ''] || [];

  // Completed & Pending Tasks count
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const totalTasksCount = tasks.length;
  const dailyProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Render main layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* Top Professional Header Bar */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800 font-display">رفيق الثانوية الذكي</h1>
                <span className="text-xs bg-amber-50 text-amber-600 font-bold px-2.5 py-1 rounded-full border border-amber-100">بطل المذاكرة ⚡</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">خطوات محسوبة وتوجيه نفسي ذكي نحو حلمك الكبير</p>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto justify-center">
            
            {/* Student Info Widget */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 px-4 flex items-center gap-3.5">
              <div className="p-2 bg-slate-200 text-slate-600 rounded-xl cursor-pointer" onClick={handleResetProfile} title="تعديل تخصصك أو الكلية المفضلة">
                <User className="w-4 h-4" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">البطل الحالي:</div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <span>{profile.name}</span>
                  <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    {profile.branch === 'science' ? 'علمي علوم' : profile.branch === 'math' ? 'علمي رياضة' : 'أدبي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Target College Widget */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 px-4 flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                <Award className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">الهدف والكلية الكبرى:</div>
                <div className="font-bold text-rose-600 text-sm">{profile.dreamCollege} ({profile.targetScore}%)</div>
              </div>
            </div>

            {/* Total energy accumulated */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 px-4 flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl relative">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">طاقاتك المتراكمة 🔋:</div>
                <div className="font-extrabold text-amber-600 text-lg font-mono leading-none">{points} <span className="text-xs font-normal">نقطة</span></div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Dashboard layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs bar */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar scroll-smooth gap-2">
          {[
            { id: 'dashboard', label: 'الرئيسية والإحصائيات 📊' },
            { id: 'tasks', label: 'لوحة المهام الذكية 📚' },
            { id: 'timer', label: 'مؤقت بومودورو ⏱️' },
            { id: 'vent', label: 'ركن الفضفضة والتأمل 🧠' },
            { id: 'badges', label: 'مكافآتي وشاراتي 🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                currentTab === tab.id
                  ? 'border-amber-500 text-amber-600 bg-amber-50/45 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Motivational / Morning notification ribbon pop */}
        <AnimatePresence>
          {dailyQuote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8"
            >
              <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center gap-4 text-right justify-between ${
                dailyQuote.type === 'morning' 
                  ? 'bg-amber-50 border-amber-200/60 shadow-inner'
                  : dailyQuote.type === 'focus'
                  ? 'bg-orange-50 border-orange-200/60 shadow-inner'
                  : 'bg-emerald-50 border-emerald-200/60 shadow-inner'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-2xl ${
                    dailyQuote.type === 'morning' 
                      ? 'bg-amber-100 text-amber-600'
                      : dailyQuote.type === 'focus'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {dailyQuote.type === 'morning' ? <Clock className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 font-display text-base">{dailyQuote.title}</h4>
                    <p className="text-slate-600 font-medium text-sm mt-0.5 leading-relaxed">{dailyQuote.text}</p>
                  </div>
                </div>
                <button
                  onClick={fetchDailyQuote}
                  disabled={isQuoteLoading}
                  className="p-2 sm:px-4 sm:py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 border border-slate-100 text-xs font-bold cursor-pointer disabled:opacity-50"
                  title="تغيير الرسالة للحصول على جرعة تشجيع مجددة"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isQuoteLoading ? 'animate-spin' : ''}`} />
                  اشحن همتك بمقولة أخرى
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti Variable Popups Celebration Toast */}
        <AnimatePresence>
          {celebrationMsg && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md bg-gradient-to-l from-emerald-650 to-green-600 p-5 rounded-3xl text-white shadow-2xl z-50 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3 text-right">
                <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h4 className="font-bold text-lg font-display">إنجاز رائع وبطولي! 🎉</h4>
                  <p className="text-emerald-50 text-sm mt-1 leading-relaxed">{celebrationMsg}</p>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <button
                  onClick={() => setCelebrationMsg(null)}
                  className="py-1.5 px-4 bg-white text-emerald-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  حسناً وبقوة! 👍
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN TABS ROUTING --- */}
        <div id="tab-holder" className="grid grid-cols-1 gap-8">

          {/* TAB 1: DASHBOARD & PROGRESS */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stats bento layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Progress Doughnut Equivalent */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">شريط تقدم اليوم</h3>
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-3xl font-extrabold text-slate-800 font-mono">{dailyProgressPercent}%</span>
                      <span className="text-xs text-slate-400 font-medium">({completedTasksCount} من أصل {totalTasksCount} مهام متكاملة)</span>
                    </div>
                  </div>
                  
                  {/* Custom horizontal progressive block */}
                  <div className="mt-6 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dailyProgressPercent}%` }}
                        className="h-full bg-gradient-to-l from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs font-semibold text-amber-600 mt-2 text-center">
                      {dailyProgressPercent === 100 
                        ? 'أنت مذهل تماماً! أنهيت كل المطلوب منك اليوم 🌟'
                        : dailyProgressPercent >= 50
                        ? 'أكثر من النصف مكتمل.. واصل الضغط يا بطل!'
                        : totalTasksCount > 0 
                        ? 'بداية رائعة، خطوة تلو الأخرى وهتوصل لحصاد القمة!'
                        : 'لم تضف أي مهام لجدولك اليوم بعد. ابدأ الآن!'}
                    </p>
                  </div>
                </div>

                {/* High School Energy Rank */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">رتبة بطل الثانوية</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-xl font-bold text-slate-800">
                        {points >= 200 ? 'الأسطورة الخارقة الروحية 🌌' : points >= 100 ? 'مقاوم الصعاب والمتاعب 🔥' : 'المقاتل الصاعد 🎯'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 leading-relaxed bg-slate-50 p-3 rounded-2xl">
                    كل جلسة بومودورو تعطيك <b>15 نقطة</b> وكل تذكرة مهمة تنجزها تمنحك <b>10 نقاط طاقة</b> تفتح بها شارات فخرية.
                  </p>
                </div>

                {/* Quick actions direct paths */}
                <div className="bg-gradient-to-l from-amber-500 to-orange-500 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-amber-50 font-display">ركن الفضفضة والتأمل 🧠</h4>
                    <p className="text-amber-50 text-xs mt-1.5 leading-relaxed">
                      هل تعاني من توتر الامتحانات؟ لا تحتفظ بضغطك لنفسك. رفيقك الذكي متواجد للاستماع إليك وتخفيف عبء المذاكرة عن قلبك فوراً.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('vent')}
                    className="mt-4 py-2.5 px-4 bg-white/20 hover:bg-white text-white hover:text-orange-600 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/30"
                  >
                    <span>تفريغ وبدء الفضفضة</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Grid: Challenges list & active tasks snap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Right col: Weekly / Daily Challenges */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span>تحديات شحن الهمة اليومية</span>
                    </h3>
                    <span className="text-xs text-slate-400">نقاط سريعة وفورية</span>
                  </div>

                  <div className="space-y-4">
                    {challenges.map((ch) => {
                      const isComplete = ch.currentCount >= ch.targetCount;
                      return (
                        <div 
                          key={ch.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            ch.isClaimed 
                              ? 'bg-slate-50/50 border-slate-100 opacity-70' 
                              : isComplete 
                              ? 'bg-amber-50/40 border-amber-200' 
                              : 'bg-white border-slate-100'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              <span>{ch.title}</span>
                              {ch.isClaimed && <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full border border-emerald-100">مكتمل ومستلم</span>}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">{ch.description}</p>
                            
                            {/* Tracker status progress line */}
                            {!ch.isClaimed && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${(ch.currentCount / ch.targetCount) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono font-bold">{ch.currentCount}/{ch.targetCount}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            {!ch.isClaimed ? (
                              <button
                                onClick={() => handleClaimChallenge(ch.id, ch.pointsReward)}
                                disabled={!isComplete}
                                className={`py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                  isComplete 
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                }`}
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>استلم {ch.pointsReward} نقطة</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 font-bold">تم الإنجاز</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Left col: Focus guidelines & Quick Pomo trigger */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-display mb-5 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-500" />
                      <span>تقنية البومودورو للمذاكرة الذكية 🧠</span>
                    </h3>
                    <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                      <p>
                        تعتبر <b>تقنية البومودورو (Pomodoro Technique)</b> هي الطريقة المثلى عالمياً لطلاب الثانوية العامة للتخلص من التشتت والملل، وهي تعمل كالتالي:
                      </p>
                      <ul className="list-disc list-inside space-y-2 pr-2">
                        <li>تحدد المهمة التي تريد مذاكرتها (مثل درس الفيزياء).</li>
                        <li>تقوم بضبط المؤقت على <b>25 دقيقة</b> للمذاكرة بتركيز كامل دون فتح الهاتف إطلاقاً.</li>
                        <li>بعد انتهاء الـ 25 دقيقة، تأخذ استراحة إجبارية لمدة <b>5 دقائق</b> لتنفس العقل.</li>
                        <li>كرر هذه الدورة أربع مرات ثم خذ استراحة أطول.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">جاهز لبدء دورة تركيز جديدة؟</span>
                    <button
                      onClick={() => setCurrentTab('timer')}
                      className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                      <span>افتح شاشة المؤقت</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TASK BOARD MANAGEMENT */}
          {currentTab === 'tasks' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form to add tasks */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-lg font-bold text-slate-800 font-display mb-4">إنشاء مهمة دراسية جديدة ✨</h3>
                  
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold">ماذا تريد أن تذاكر وتحل؟</label>
                      <input
                        type="text"
                        placeholder="مثال: مراجعة الباب الثاني كيمياء..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none text-sm transition"
                        maxLength={80}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold font-display">تبعاً لأي مادة دراسية؟</label>
                      <select
                        value={newTaskSubject}
                        onChange={(e) => setNewTaskSubject(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none text-sm transition bg-white"
                      >
                        <option value="">-- اختر مادة --</option>
                        {availableSubjects.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                        <option value="تطوير عام">تطوير عام وتحفيز</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal">
                      إنجاز هذه المهمة سيمنحك فوراً <b>10 نقاط طاقة</b> لدعم حصالتك وشاراتك التنافسية!
                    </p>

                    <button
                      type="submit"
                      disabled={!newTaskTitle.trim()}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة للمهام اليومية
                    </button>
                  </form>
                </div>

                {/* Tasks lists status */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-display">مهامك وجدولك اليومي</h3>
                      <p className="text-xs text-slate-400 mt-0.5">قسم المواد الكبيرة لخطوات بسيطة لتفادي الضغط الدراسي</p>
                    </div>
                    
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      تم إنجاز {completedTasksCount} / {totalTasksCount}
                    </span>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                      <Calendar className="w-12 h-12 text-slate-200" />
                      <p className="text-sm font-medium">جدولك لليوم فارغ وحالياً مريح يا بطل.</p>
                      <p className="text-xs text-slate-400 max-w-xs">ابدأ بإدخال الدروس المطلوب مذاكرتها ليقوم التطبيق بتقسيمها وتشجيعك عند الإنجاز!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            task.isCompleted
                              ? 'bg-slate-50/50 border-slate-100 opacity-70'
                              : 'bg-white border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTask(task.id)}
                              className="mt-0.5 text-amber-500 hover:text-amber-600 transition cursor-pointer"
                            >
                              {task.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 hover:text-amber-500" />
                              )}
                            </button>

                            <div>
                              <p className={`text-sm font-semibold transition text-slate-800 ${task.isCompleted ? 'line-through text-slate-400 font-normal' : ''}`}>
                                {task.title}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                                  {task.subject}
                                </span>
                                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                  <Flame className="w-3 h-3" />+{task.energyPoints} نقطة
                                </span>
                                {task.pomodoroCount > 0 && (
                                  <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
                                    <Clock className="w-3 h-3 animate-pulse" /> {task.pomodoroCount} بومودورو تركيز
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="حذف المهمة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: FOCUS TIMER SCREEN (POMODORO) */}
          {currentTab === 'timer' && (
            <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
              <FocusTimer 
                onPomoComplete={handlePomoComplete} 
                studentName={profile.name} 
              />
            </div>
          )}

          {/* TAB 4: CHAT WITH AI SENSITIVE MENTOR */}
          {currentTab === 'vent' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              
              {/* Vent context header container */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row hover:border-amber-100 items-center justify-between gap-5 text-right transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                    <HeartHandshake className="text-amber-500 w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-display">ركن الفضفضة والتأمل الروحي 🔮</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      هنا ركنك الآمن للفضفضة! اكتب ما تشعر به من ضغوط، خوف من الامتحانات، تعب، أو إرهاق كلي.
                      رفيقك الذكي سيتفهمك بحنان، يدعمك بذكاء وبطريقة مبهجة تعيد شحن طاقتك النفسية فوراً!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClearChat}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                >
                  تصفير المحادثة
                </button>
              </div>

              {/* Chat messages viewport */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[550px]">
                
                {/* Scrollable messages container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
                  {ventMessages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
                      >
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                          isUser ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isUser ? 'أنا' : 'رفيق'}
                        </div>

                        {/* Text bubble */}
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          isUser 
                            ? 'bg-amber-500 text-white rounded-tr-none shadow-md shadow-amber-500/10' 
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-wrap'
                        }`}>
                          {msg.text}
                          <span className={`block text-[10px] mt-2 text-left ${isUser ? 'text-amber-100' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing placeholder loader */}
                  {isChatLoading && (
                    <div className="flex gap-3 max-w-[85%] ml-auto">
                      <div className="h-8 w-8 rounded-full bg-slate-200 text-xs flex items-center justify-center shrink-0">
                        ...
                      </div>
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none text-slate-500 text-sm flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                        <span>رفيقك بيفكر بقلب دافئ و بيكتب الرد دلوقتي...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Send Prompt Input bar */}
                <form onSubmit={handleSendVent} className="p-4 border-t border-slate-100 bg-white flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="فضفض لي يا بطل.. إيه اللي تاعبك أو مضايقك في المذاكرة دلوقتي؟"
                    className="flex-1 p-4 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none text-sm transition"
                    disabled={isChatLoading}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="p-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl transition shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
                    title="إرسال الفضفضة"
                  >
                    <Send className="w-5 h-5 transform rotate-180" />
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* TAB 5: UNLOCKED SHIELDS & GAMIFICATION CHRONICLES */}
          {currentTab === 'badges' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 font-display">ركن المكافآت وشارات التميز للثانوية</h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto mt-2">
                  تحدياتك ومساهمتك اليومية تملأ حصالة نقاطك. كلما رفعت نشاطك كلما فتحت أوسمة شجاعة تعزز ثقتك لرحلة القمة!
                </p>

                {/* Overall status progress */}
                <div className="mt-6 flex justify-center gap-6">
                  <div className="bg-slate-50 p-3 rounded-2xl px-6">
                    <span className="block text-xs text-slate-400">إجمالي النقاط:</span>
                    <span className="text-xl font-extrabold text-amber-600 font-mono">{points}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl px-6">
                    <span className="block text-xs text-slate-400">شارات مفتوحة:</span>
                    <span className="text-xl font-extrabold text-slate-800 font-mono">
                      {badges.filter(b => b.unlockedAt).length} من {badges.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements grid lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge) => {
                  const isUnlocked = !!badge.unlockedAt;
                  return (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-3xl border transition-all flex flex-col items-center text-center relative overflow-hidden ${
                        isUnlocked
                          ? 'bg-white border-amber-200 shadow-md ring-2 ring-amber-500/5'
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                      }`}
                    >
                      {/* Shield background glows */}
                      {isUnlocked && (
                        <div className="absolute inset-0 bg-radial-gradient from-amber-50/20 via-transparent to-transparent" />
                      )}

                      {/* Icon */}
                      <div className={`p-4 rounded-2xl mb-4 relative z-10 ${
                        isUnlocked 
                          ? 'bg-amber-100 text-amber-600' 
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        {badge.iconName === 'Award' && <Award className="w-8 h-8" />}
                        {badge.iconName === 'Timer' && <Clock className="w-8 h-8" />}
                        {badge.iconName === 'Zap' && <Flame className="w-8 h-8" />}
                        {badge.iconName === 'HeartHandshake' && <HeartHandshake className="w-8 h-8" />}
                        {badge.iconName === 'Flame' && <Flame className="w-8 h-8" />}
                        {badge.iconName === 'Trophy' && <Trophy className="w-8 h-8" />}
                      </div>

                      <h4 className="font-bold text-slate-800 text-base z-10">{badge.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed z-10 max-w-[200px]">{badge.description}</p>

                      {/* Status label / requirements */}
                      <div className="mt-5 w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 z-10 text-xs font-semibold">
                        {isUnlocked ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مفتوح في: {badge.unlockedAt}
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            يحتاج: {badge.requiredPoints} نقطة طاقة
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-100 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 رفيق الثانوية العامة الذكي. جميع الحقوق لكل الطلاب الأبطال.</p>
          <p className="flex items-center gap-1.5">
            صُنع بحب ودعم لطلاب البكالوريا ومستقبل الأمة العربية 💡🎓
          </p>
        </div>
      </footer>

    </div>
  );
}
