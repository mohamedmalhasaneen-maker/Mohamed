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
  StudyChallenge,
  ActivityLog
} from './types';
import { 
  SUBJECTS_BY_BRANCH, 
  INITIAL_BADGES, 
  INITIAL_CHALLENGES, 
  getRandomCelebration,
  getOfflineAIResponse,
  STARTUP_DUAS,
  MOTIVATIONAL_SLOGANS,
  SUBJECT_STUDY_TIPS
} from './data';
import Onboarding from './components/Onboarding';
import FocusTimer from './components/FocusTimer';
import AuthScreen from './components/AuthScreen';
import ProfileTab from './components/ProfileTab';
import HeroNotes from './components/HeroNotes';
import SubjectMindMap from './components/SubjectMindMap';
import RafiqStudy from './components/RafiqStudy';
import DeepFocusView from './components/DeepFocusView';
import GroupChallenges from './components/GroupChallenges';
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
  ChevronLeft,
  LogOut,
  Camera,
  Sun,
  Moon,
  Mic,
  MicOff,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 2.56 1.488 4.582 1.489 5.485 0 9.95-4.461 10.003-9.944.026-2.653-.979-5.143-2.842-7.009C16.486 1.83 14.004 1.01 11.45 1.01c-5.495 0-9.96 4.466-9.963 9.952-.001 2.05.535 4.053 1.551 5.8l-.29 1.058-.646 2.361 2.42-.635.807-.212-.279.168zm11.393-8.243c-.354-.176-2.09-.323-2.484-.467-.31-.115-.536-.174-.761.163-.225.337-.872 1.101-1.07 1.325-.196.223-.393.249-.747.072-1.347-.674-2.22-1.22-3.1-2.727-.234-.4-.234-.69.043-.966.215-.213.479-.558.718-.838.239-.28.32-.48.479-.8.16-.32.08-.6-.041-.84-.12-.24-.761-2.046-1.07-2.793-.3-.722-.607-.624-.833-.635-.215-.01-.462-.012-.71-.012-.247 0-.651.093-.992.467-.34.375-1.302 1.272-1.302 3.102 0 1.829 1.329 3.593 1.514 3.84.184.248 2.61 4.002 6.324 5.602.883.38 1.573.607 2.112.778.887.282 1.695.242 2.333.147.712-.107 2.19-.894 2.499-1.758.309-.863.309-1.605.216-1.759-.093-.154-.34-.247-.693-.423z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.568 8.161c-.181 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.321.016.108.033.318.018.498z"/>
  </svg>
);

export default function App() {
  // --- OFFLINE AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const loadedUserRef = useRef<string | null>(null);

  // --- CORE STATE ---
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deepFocusTaskId, setDeepFocusTaskId] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [challenges, setChallenges] = useState<StudyChallenge[]>(INITIAL_CHALLENGES);
  const [ventMessages, setVentMessages] = useState<Message[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks' | 'study' | 'timer' | 'vent' | 'badges' | 'profile'>(() => {
    return (localStorage.getItem('thanaweya_last_tab') as any) || 'dashboard';
  });
  
  // App UI states
  const [dailyQuote, setDailyQuote] = useState<{title: string, text: string, type: string} | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [statsMetric, setStatsMetric] = useState<'hours' | 'pomodoros'>('hours');
  const [hasDismissedStartupDua, setHasDismissedStartupDua] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [currentStartupDua, setCurrentStartupDua] = useState(() => {
    const index = Math.floor(Math.random() * STARTUP_DUAS.length);
    return STARTUP_DUAS[index];
  });

  const handleNextStartupDua = () => {
    const filtered = STARTUP_DUAS.filter(d => d.id !== currentStartupDua.id);
    const index = Math.floor(Math.random() * filtered.length);
    setCurrentStartupDua(filtered[index] || STARTUP_DUAS[0]);
  };

  const handleStartVoiceNote = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('عذراً، متصفحك لا يدعم خاصية التعرف على الصوت. جرب متصفح جوجل كروم.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceFeedback('جاري الاستماع إليك.. تكلم الآن يا بطل 🎙️✨');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        const title = transcript.trim();
        setVoiceFeedback(`تم التعرف: "${title}" ✅`);
        
        // Automatically add the task as requested
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: title,
          subject: newTaskSubject || 'مادة عامة',
          isCompleted: false,
          energyPoints: 10,
          pomodoroCount: 0,
          createdAt: new Date().toISOString()
        };

        setTasks(prev => [newTask, ...prev]);
        logActivity('task_add', `أضفت مهمة صوتية جديدة لمادة ${newTask.subject}: "${newTask.title}" 🎙️📝`);
        setNewTaskTitle('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
      
      if (event.error === 'not-allowed') {
        setVoiceFeedback('عذراً، الوصول للميكروفون غير مصرح به 🎙️🚫 - لو كنت تستخدم التطبيق من داخل نافذة المراجعة، يرجى فتحه في علامة تبويب كاملة جديدة (الزر أعلى اليمين) أو السماح للميكروفون من إعدادات الأمان لشريط العنوان ليعمل بشكل سليم!');
      } else {
        setVoiceFeedback('حدث خطأ في التعرف على الصوت، حاول مرة أخرى ❌');
      }
      
      setTimeout(() => setVoiceFeedback(null), 12000);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setTimeout(() => setVoiceFeedback(null), 4000);
    };

    recognition.start();
  };

  // Live Clock State
  const [liveTime, setLiveTime] = useState(() => new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // --- DARK MODE STATE ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('thanaweya_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('thanaweya_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('thanaweya_dark_mode', 'false');
    }
  }, [darkMode]);

  // Header visibility on scroll (hides when scrolling down, shows when scrolling up/at top)
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scroll is near top, always show header
      if (currentScrollY < 80) {
        setShowHeader(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;
      
      // Set scroll threshold to avoid jittering
      if (Math.abs(diff) > 8) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> hide
          setShowHeader(false);
        } else {
          // Scrolling up -> show
          setShowHeader(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('thanaweya_last_tab', currentTab);
  }, [currentTab]);

  const getDaysUntilExam = (examDateStr: string | undefined | null) => {
    if (!examDateStr) return null;
    const examDate = new Date(examDateStr);
    const today = new Date();
    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getFormattedArabicDateValue = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('ar-EG', options);
  };

  // Task Form inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [taskFilterSubject, setTaskFilterSubject] = useState('all');

  // AI Vent inputs
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- LOCAL STORAGE EFFECTS ---
  // Initial check for active session
  useEffect(() => {
    const savedUser = localStorage.getItem('thanaweya_current_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      setIsLoadingProfile(false);
    }
  }, []);

  // Sync / Load data based on logged-in user changes
  useEffect(() => {
    if (!currentUser) {
      setProfile(null);
      setTasks([]);
      setPoints(0);
      setBadges(INITIAL_BADGES);
      setChallenges(INITIAL_CHALLENGES);
      setVentMessages([]);
      loadedUserRef.current = null;
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    const prefix = `thanaweya_user_${currentUser}`;
    const savedProfile = localStorage.getItem(`${prefix}_profile`);
    const savedTasks = localStorage.getItem(`${prefix}_tasks`);
    const savedPoints = localStorage.getItem(`${prefix}_points`);
    const savedBadges = localStorage.getItem(`${prefix}_badges`);
    const savedChallenges = localStorage.getItem(`${prefix}_challenges`);
    const savedChatHistory = localStorage.getItem(`${prefix}_chat`);

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }

    if (savedPoints) {
      setPoints(Number(savedPoints));
    } else {
      setPoints(0);
    }

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        setBadges(INITIAL_BADGES);
      }
    } else {
      setBadges(INITIAL_BADGES);
    }

    if (savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch (e) {
        setChallenges(INITIAL_CHALLENGES);
      }
    } else {
      setChallenges(INITIAL_CHALLENGES);
    }

    if (savedChatHistory) {
      try {
        setVentMessages(JSON.parse(savedChatHistory));
      } catch (e) {
        setVentMessages([]);
      }
    } else {
      setVentMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `أهلاً بك يا بطل! أنا "رفيق الثانوية" الذكي. فنان في تبسيط الأمور، وفي ضهرك دايماً. لما تحس بضغط، توتر، أو مكسل ومحتاج فرفشة ودعم نفسي، اكتب لي هنا على طول وفضفض بقلبك، وهتلاقيني بسمعك بحب وبديك طاقة تكمل بيها طريقك للقمة! 🎯🌟`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    const savedActivityLogs = localStorage.getItem(`${prefix}_activity_logs`);
    if (savedActivityLogs) {
      try {
        setActivityLogs(JSON.parse(savedActivityLogs));
      } catch (e) {
        setActivityLogs([]);
      }
    } else {
      setActivityLogs([
        {
          id: 'init-onboard',
          type: 'auth',
          description: 'مرحباً بك يا بطل في منصة رفيق الثانوية! أنشأت حسابك وبدأت رحلة المجد للقمة 🚀🌟',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' })
        }
      ]);
    }

    loadedUserRef.current = currentUser;
    setIsLoadingProfile(false);
    fetchDailyQuote();
  }, [currentUser]);

  // Scoped synchronized persistence effects
  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current && profile) {
      localStorage.setItem(`thanaweya_user_${currentUser}_profile`, JSON.stringify(profile));
    }
  }, [profile, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current) {
      localStorage.setItem(`thanaweya_user_${currentUser}_tasks`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current) {
      localStorage.setItem(`thanaweya_user_${currentUser}_badges`, JSON.stringify(badges));
    }
  }, [badges, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current) {
      localStorage.setItem(`thanaweya_user_${currentUser}_challenges`, JSON.stringify(challenges));
    }
  }, [challenges, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current) {
      localStorage.setItem(`thanaweya_user_${currentUser}_chat`, JSON.stringify(ventMessages));
      if (chatBottomRef.current) {
        chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [ventMessages, currentUser]);

  useEffect(() => {
    if (currentUser && currentUser === loadedUserRef.current) {
      localStorage.setItem(`thanaweya_user_${currentUser}_activity_logs`, JSON.stringify(activityLogs));
    }
  }, [activityLogs, currentUser]);

  // --- FUNCTIONS & API CALLS ---
  const fetchDailyQuote = async () => {
    setIsQuoteLoading(true);
    
    // Extracted dynamic student metadata for personalized quotes
    const sName = profile?.name || 'يا بطل';
    const sCollege = profile?.dreamCollege || 'الكلية اللي بتتمناها';
    const sScore = profile?.targetScore || '99';
    let branchCustomTitle = "عزيمة لا تلين 🚀";
    let branchCustomQuote = "التعب والضغط فترة وهتعدي وهتفتخر باللي عملته يا وحش تالتة ثانوي!";

    if (profile?.branch === 'science') {
      branchCustomTitle = "أبطال علمي علوم 🧬";
      branchCustomQuote = `كتاب الأحياء وعلم وظائف الأعضاء محتاج بطل زيك يا ${sName}! فكر في فرحتك لما تلبس البالطو الأبيض وتدخل الكلية.. شد حيلك وعافر!`;
    } else if (profile?.branch === 'math') {
      branchCustomTitle = "أساطير علمي رياضة 📐";
      branchCustomQuote = `المعادلات الصعبة والفيزياء مش واقفة عائق قدام ذكائك وعزيمتك يا مهندس المستقبل ${sName}! بكرة تبني أحلامك خطوة بخطوة.`;
    } else if (profile?.branch === 'literature') {
      branchCustomTitle = "فرسان الشعبة الأدبية 📚";
      branchCustomQuote = `التاريخ والجغرافيا وعلم النفس بمثابة حكاية نجاحك يا ${sName}! الفهم العالي والتحليل بتوعك هما طريقك للقمة ولأفضل الكليات.`;
    }

    // 100% Offline Quote Pool with dynamic, beautiful Cairo student support
    const localQuotes = [
      {
        title: "رسالة الصباح الباكر ☀️",
        text: `صباح الخير يا ${sName}! يوم جديد فرصة جديدة تشحن فيها طاقتك وتقرب خطوة كمان من حلمك لـ ${sCollege}. كوباية قهوتك ويلا بينا!`,
        type: "morning"
      },
      {
        title: "طاقة للتركيز ⏱️",
        text: `حصالة أحلامك بتتملي بكل دقيقة تعب ومذاكرة بتعملها دلوقتي يا ${sName}. تعبك ومجهودك عمره ما هيروح هدر أبداً يا وحش!`,
        type: "focus"
      },
      {
        title: "صديقك المخلص هنا 🤝",
        text: "حاسس بتعب أو إرهاق؟ طبيعي جداً.. خد استراحة قصيرة، افتكر حلمك، وارجع أقوى. أنا هنا مستنيك تكمل بطولتك!",
        type: "support"
      },
      {
        title: "جرعة ثقة 💪",
        text: "مفيش مادة صعبة على بطل زيك! خطة بسيطة، كوب شاي، وتركيز بومودورو واحد وهتقضي عليها تماماً وبكل سهولة.",
        type: "focus"
      },
      {
        title: "الحلم يناديك 🌟",
        text: `تخيل دقات قلبك وفرحة أهلك يوم النتيجة لما تلاقي مجموعك ${sScore}% على الشاشة وناجح في ${sCollege}! اللحظة دي تسوى الدنيا!`,
        type: "support"
      },
      {
        title: "عزيمة لا تلين 🚀",
        text: `أنت لست مجرد طالب عادي، أنت مقاتل حقيقي يصنع مستقبله بيديه يا ${sName}. لا تلتفت للوراء، استمر في التقدم والتحصيل!`,
        type: "morning"
      },
      {
        title: "شاحن الهمة 💡",
        text: "النجاح يبدأ من استغلال اللحظة الحالية. افتح كتابك بابتسامة، انسَ ما فات، وركز في الصفحة اللي قدامك كأنها معركتك الوحيدة!",
        type: "focus"
      },
      {
        title: "فخور بك جداً ❤️",
        text: `حتى لو حسيت بالتقصير أحياناً يا ${sName}، فمجهودك المستمر ومحاولتك تصنع منك بطلاً أقوى كل يوم. استرخي ثم أكمل طريقك بثقة!`,
        type: "support"
      },
      {
        title: "وقود العزيمة ⛽",
        text: `النتيجة النهائية مش صدفة، دي انعكاس للجهد المستخبي اللي محدش بيشوفه غير ربنا. عافر علشان تفرح بجد في النهاية في ${sCollege}!`,
        type: "support"
      },
      {
        title: "رسالة بطل الـ 100% 🏅",
        text: "كل قانون مادة بمثابة فرصة لتكون نجم تالتة ثانوي. بكرة المجموع والتقدير يشرفوك قدام الدنيا كلها وطريقك لسه مفتوح يا أسد!",
        type: "focus"
      },
      {
        title: "همسة نجاح 🤫",
        text: "لو حاسس بصعوبة النهاردة، افتكر إن ده طبيعي ومفيش نجاح بيجي مريح. كمل مذاكرة وسيب الباقي على ربنا، هيكرمك كرم يليق بجهدك!",
        type: "support"
      },
      {
        title: "تنبيه طوارئ للروح 🚨",
        text: `الخطوة الأولى هي الأصعب دايماً يا ${sName}. متفكرش في المنهج كله، فكر في الـ 20 صفحة اللي قدامك دلوقتي وبس!`,
        type: "focus"
      },
      {
        title: "رسالة إلى دكتور / مهندس الغد 👑",
        text: `بكرة تدخل مدرجات ${sCollege} وتفتكر الساعات دي وتضحك.. هتقول لنفسك: الحمد لله إني مستسلمتش في اللحظات القديمة دي.`,
        type: "support"
      },
      {
        title: "التركيز المطلق 🎯",
        text: "المشتتات كتير والمستقبل واحد. اقفل الموبايل، ركز عينك على الحلم، وقول لنفسك: تالتة ثانوي بتاعتي وأنا قدها وقدود!",
        type: "focus"
      },
      {
        title: "الذهب يصنع في النار 🔥",
        text: "الضغط والامتحانات والتوتر ده كله بيبنيك وبيصنع منك شخصية حديدية للمستقبل. مفيش معدن غالي بيطلع من غير حرارة وصبر.",
        type: "support"
      },
      {
        title: "دموع الفرحة القادمة 🥹",
        text: `افتكر دموع الفرحة في عيون والدتك ووالدك لما قرايبك يتصلوا يباركولك على مجموع ${sScore}%. فرحتهم بيك تستاهل تسهر وتتعب!`,
        type: "support"
      },
      {
        title: "نصيحة أستاذ ذكي 🎓",
        text: "الذكي مش اللي بيذاكر 20 ساعة.. الذكي هو اللي بيبدأ يومه بجدول منظم، ويقسم مجهوده بومودورو بومودورو، ويفهم بدل ما يحفظ صم!",
        type: "focus"
      },
      {
        title: "سر النجاح الصغير ✨",
        text: "السر والخلطة السحرية للقمة هي (الاستمرارية). حبة مذاكرة صغيرين كل يوم أحسن بكتير من سباق عشوائي يوم واحد والكسل بقية الأسبوع.",
        type: "support"
      },
      {
        title: "إضاءة عقلية 💡",
        text: `عقلك الباطن بيسجل كل سطر بتعيده وكل فكرة بتفهمها يا ${sName}. ثق في ذاكرتك، أنت أذكى وأقوى مما تتخيل بكتير!`,
        type: "focus"
      },
      {
        title: "رصاصة العزيمة ⚡",
        text: "ابعد عن الناس السلبية اللي بتقول المنهج تراكم والوقت راح. لسه في وقت، ولسه الحلم متاح ومكتوب باسمك لو عافرت وسعيت!",
        type: "morning"
      },
      {
        title: "سفر البطل التاريخي 🗺️",
        text: `قدامك لسه فرصة كبيرة تكتب سيناريو عظيم لنهاية السنة دي يا ${sName}. الناس هتنسى البدايات العشوائية وتفتكر بس النهايات القوية!`,
        type: "morning"
      },
      {
        title: "سند روحي حنون 🕋",
        text: `يقول الله تعالى: "سيجعل الله بعد عسرٍ يسراً". اطمئن يا ${sName}، ربنا مستحيل يضيع سعيك وأنت صادق النية وتتعب بجد.`,
        type: "support"
      },
      {
        title: "جرعة أمل ويقين ✨",
        text: "الخوف طبيعي بس الشجاعة هي إنك تذاكر وأنت خايف.. فوض أمرك لله وابدأ، هتلاقي الأبواب المغلقة انفتحت قدامك بكل تيسير.",
        type: "support"
      },
      {
        title: "معادلة العبقرية 🌌",
        text: "التوفيق من عند ربنا سبحانه وتعالى، والمحاولة والجهد الصادق من عندك أنت. متستعجلش النتيجة واقلق بس لو مقصر، كمل سعي بكل حب وعزيمة.",
        type: "focus"
      },
      {
        title: "تحدي تالتة ثانوي 🤜🤛",
        text: "بكرة تفتخر بكل صفحة قاومتها، وكل قانون حفظته وسهرت معاه بالليل والناس نايمة. أنت مش بس بتذاكر، أنت بتصنع مستقبلك وشخصيتك!",
        type: "focus"
      },
      {
        title: "دعاء الفجر المستجاب 🤲",
        text: `أهلك نفسهم يشوفوك أسعد إنسان في الكوكب وفي ${sCollege} رافع راسهم وراسك. خلي حبهم ودعواتهم ليك وقوداً لا ينضب!`,
        type: "support"
      },
      {
        title: "النيل الحكيم 🌊",
        text: "مستقبلك ماراثون طويل ومجهودك يستحق التقدير. تعرق دلوقتي في المذاكرة وتحضر نفسك عشان تكون في كليتك الهدف فخور بمسيرتك وبطولتك تالتة ثانوي.",
        type: "morning"
      },
      {
        title: "مستقبلك المنور 🔥",
        text: "قوم عافر وركز وافتح كتابك عشان فرحة النجاح يوم النتيجة مفيش إحساس يعادلها في الدنيا كلها! تستاهل تتعب عشانها يا وحش.",
        type: "focus"
      },
      {
        title: "بطولة النفس الطويل 🦸‍♂️",
        text: "الامتحانات بتقرب ودي بطولتك الخاصة. اللي نفسه طويل وبيستحمل للآخر هو اللي بيكسب الماتش الحقيقي في النهاية. خلي نفسك طويل وثابت!",
        type: "support"
      },
      {
        title: "تصحيح المسار 🌅",
        text: "تغلط وتتعلم في البيت دلوقتي بمية مرة أحسن من اللخبطة في الامتحان الحقيقي. كل غلطة هي فرصة ذهبية لتقوية مستواك وتأمين الدرجة النهائية!",
        type: "focus"
      },
      {
        title: "مقولة مأثورة من القلب 💖",
        text: `ثق تماماً يا ${sName} إن ربنا سبحانه وتعالى لا يضيع أجر من أحسن عملاً. مجهودك وتعبك غالي ومحفوظ، تفاءل بالخير وهتوصل بإذن الله.`,
        type: "support"
      },
      {
        title: branchCustomTitle,
        text: branchCustomQuote,
        type: "support"
      },
      {
        title: "تأمل المساء الطيب 🌃",
        text: "قبل ما تنام النهاردة، راجع إنجازاتك واشكر نفسك على محاولاتك. بكرة يوم جديد وعظيم، ارتاح كويس عشان تبدأ يومك بقمة النشاط!",
        type: "morning"
      }
    ];

    try {
      const randomIndex = Math.floor(Math.random() * localQuotes.length);
      setDailyQuote(localQuotes[randomIndex]);
    } catch (e) {
      console.error("Error loading quote", e);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const logActivity = (type: ActivityLog['type'], description: string) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      type,
      description,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' })
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const getWeeklyStatsData = () => {
    const DAYS_ARABIC = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    
    // Day of week index (Sunday: 0, Monday: 1, ..., Saturday: 6)
    const todayIndex = new Date().getDay(); 
    // Map Sunday -> 1, Monday -> 2, ..., Saturday -> 0
    const mappedTodayIndex = todayIndex === 6 ? 0 : todayIndex + 1;

    // Actual metrics from logs
    const todayActualPomodoros = activityLogs.filter(log => log.type === 'pomodoro').length;
    const todayActualTasks = activityLogs.filter(log => log.type === 'task_complete' && !log.description.includes('حذف')).length;
    
    const sessionMins = localStorage.getItem('thanaweya_focus_study_minutes') 
      ? Number(localStorage.getItem('thanaweya_focus_study_minutes')) 
      : 25;
    
    // Balanced baseline representing prior progress
    let baselinePomodoros = [3, 4, 3, 5, 2, 4, 0];
    if (profile?.branch === 'science') {
      baselinePomodoros = [4, 5, 3, 6, 4, 3, 1];
    } else if (profile?.branch === 'math') {
      baselinePomodoros = [5, 4, 4, 5, 5, 2, 0];
    } else if (profile?.branch === 'literature') {
      baselinePomodoros = [3, 3, 4, 3, 4, 4, 2];
    }

    return DAYS_ARABIC.map((dayName, idx) => {
      let pomodoros = baselinePomodoros[idx];
      let tasks = Math.max(1, Math.round(pomodoros * 0.7));
      
      if (idx === mappedTodayIndex) {
        pomodoros = todayActualPomodoros;
        tasks = todayActualTasks;
      } else if (idx > mappedTodayIndex) {
        // Future days have 0
        pomodoros = 0;
        tasks = 0;
      }
      
      const hours = Math.round(((pomodoros * sessionMins + tasks * 10) / 60) * 10) / 10;

      return {
        name: dayName,
        'جلسات بومودورو المنجزة': pomodoros,
        'ساعات المذاكرة المقدرة': hours,
        'المهام المنجزة': tasks,
      };
    });
  };

  const handleLogin = (username: string) => {
    localStorage.setItem('thanaweya_current_user', username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    if (confirm('هل ترغب في تسجيل الخروج من حسابك الحالي للتبديل لحساب بطل آخر؟')) {
      localStorage.removeItem('thanaweya_current_user');
      setCurrentUser(null);
    }
  };

  const handleProfileComplete = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    // Add 15 quick points for signing up
    setPoints((prev) => prev + 15);
    logActivity('auth', `تم إعداد ملفك الشخصي بنجاح يا بطل! الكلية الهدف: ${newProfile.dreamCollege || 'مستقبل رائع'} 🎓✨`);
  };

  const handleProfileSave = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    logActivity('auth', `قمت بتحديث ملفك الشخصي بنجاح! طموحاتك الآن تتجه نحو: ${updatedProfile.dreamCollege} 🎓🚀`);
  };

  const forceSaveAllData = () => {
    if (!currentUser) return;
    const prefix = `thanaweya_user_${currentUser}`;
    
    // Explicitly update localStorage items instantly
    if (profile) {
      localStorage.setItem(`${prefix}_profile`, JSON.stringify(profile));
    }
    localStorage.setItem(`${prefix}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${prefix}_points`, String(points));
    localStorage.setItem(`${prefix}_badges`, JSON.stringify(badges));
    localStorage.setItem(`${prefix}_challenges`, JSON.stringify(challenges));
    localStorage.setItem(`${prefix}_chat`, JSON.stringify(ventMessages));
    localStorage.setItem(`${prefix}_activity_logs`, JSON.stringify(activityLogs));
    
    // Save active user info too
    localStorage.setItem('thanaweya_current_user', currentUser);
    
    // Log the backup action
    logActivity('auth', 'تم حفظ نسخة احتياطية لكافة تفاصيل حسابك يدوياً بنجاح! 💾🛡️');
    
    // Show user-friendly success overlay toast
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 4000);
  };

  const checkBadgesProgress = (currentPoints: number) => {
    setBadges((prevBadges) => {
      let newlyUnlocked: string[] = [];
      const updated = prevBadges.map((badge) => {
        if (!badge.unlockedAt && currentPoints >= badge.requiredPoints) {
          newlyUnlocked.push(badge.title);
          return {
            ...badge,
            unlockedAt: new Date().toLocaleDateString('ar-EG')
          };
        }
        return badge;
      });
      if (newlyUnlocked.length > 0) {
        setTimeout(() => {
          newlyUnlocked.forEach(title => {
            logActivity('badge_unlock', `تهانينا! حصلت على وسام فخري جديد: ${title} 🏆`);
          });
        }, 100);
      }
      return updated;
    });
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
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    setTasks(prev => [newTask, ...prev]);
    logActivity('task_add', `أضفت مهمة مذاكرة جديدة لمادة ${newTask.subject}: "${newTask.title}" 📝`);
    setNewTaskTitle('');
    setNewTaskSubject('');
  };

  // Toggle complete task
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) => {
      let taskToLog: Task | null = null;
      const updated = prevTasks.map((t) => {
        if (t.id === id) {
          const toggledState = !t.isCompleted;
          if (toggledState) {
            // Task has been marked as completed
            setPoints((pts) => pts + t.energyPoints);
            // Trigger customized Egyptian celebratory notification toast
            setCelebrationMsg(getRandomCelebration());
            updateChallengeCount('tasks');
            taskToLog = t;
          } else {
            // Un-complete task, subtract points safely
            setPoints((pts) => Math.max(0, pts - t.energyPoints));
          }
          return { ...t, isCompleted: toggledState };
        }
        return t;
      });
      if (taskToLog) {
        logActivity('task_complete', `أنجزت بنجاح مهمة مادة ${(taskToLog as Task).subject}: "${(taskToLog as Task).title}" (+10 نقاط) 🌟`);
      }
      return updated;
    });
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      logActivity('task_complete', `قمت بحذف مهمة المذاكرة: "${taskToDelete.title}" 🗑️`);
    }
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Finished a Pomodoro session
  const handlePomoComplete = () => {
    // Add 15 energy points
    setPoints((pts) => pts + 15);
    updateChallengeCount('pomodoro', 1);
    logActivity('pomodoro', `أنجزت جلسة بومودورو للمذاكرة المركزة بنجاح (+15 نقطة) ⏱️🔥`);
    
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

  // Send a message to AI Mentor (Online via Gemini with rapid dynamic responses + Offline fallback)
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
    logActivity('chat', `فضفضت مع الرفيق الذكي: "${userMsg.text.length > 30 ? userMsg.text.substring(0, 30) + '...' : userMsg.text}" 💬❤️`);

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
        throw new Error('فشل الرد من خادم الذكاء الاصطناعي.');
      }
    } catch (err: any) {
      console.warn("Retrying with intelligent local response engine...", err);
      const reply = getOfflineAIResponse(userMsg.text, profile);
      const modelMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setVentMessages((prev) => [...prev, modelMsg]);
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
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

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
      <div className="min-h-screen bg-slate-50 py-12 px-4 transition-all duration-350" dir="rtl">
        {/* Developer Identification Bar for Onboarding */}
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-100 p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-extrabold text-sm border border-amber-500 shadow-sm shrink-0">
              💻
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-bold">مطور التطبيق</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800">إسم المطور : محمد محمود</span>
                <span className="text-slate-350">|</span>
                <a 
                  href="https://wa.me/201031498281" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>واتساب: 01031498281</span>
                </a>
                <a 
                  href="https://t.me/+201031498281" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg transition"
                >
                  <TelegramIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>تيليجرام: 01031498281</span>
                </a>
              </div>
            </div>
          </div>
          <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold border border-amber-100 self-end sm:self-center">بكل فخر 🇪🇬</span>
        </div>

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

  // --- STARTUP DUA OVERLAY SCREEN ---
  if (currentUser && profile && profile.isConfigured && !hasDismissedStartupDua) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-350" dir="rtl">
        <div className="max-w-2xl w-full">
          {/* Logo or icon */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/10 mb-8"
          >
            <HeartHandshake className="w-11 h-11" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white py-10 px-6 sm:px-12 shadow-xl rounded-[2.5rem] border border-slate-100 relative overflow-hidden"
          >
            {/* Top colored highlight line */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600" />

            <div className="text-center space-y-6">
              <span className="inline-block bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-emerald-100 animate-pulse">
                🤲 بركة الاستعانة بالله قبل المذاكرة
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                يا بطل، ابدأ يومك بالاستعانة بالله 🌸✨
              </h2>

              <p className="text-slate-600 font-bold text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                قبل ما تمسك كتابك أو تبدأ أي مهمة، جدد نيتك وافتح قلبك لله.. بركة وقتك، ذكائك، سرعة فهمك وثبات معلومتك بتبدأ من هنا! 🤍
              </p>

              {/* Dua display card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStartupDua.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-l from-emerald-50/70 via-teal-50/30 to-emerald-50/70 border-2 border-dashed border-emerald-300 p-6 sm:p-8 rounded-[2rem] shadow-sm max-w-lg mx-auto text-right space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-2 mb-2" dir="rtl">
                    <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">
                      {currentStartupDua.category}
                    </span>
                    {currentStartupDua.source && (
                      <span className="text-slate-400 font-bold text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-150">
                        {currentStartupDua.source}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-black text-base sm:text-lg leading-loose text-center">
                    "{currentStartupDua.text}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Swap Dua button */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleNextStartupDua}
                  className="py-2.5 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-800 border border-slate-200/85 transition flex items-center gap-2 text-xs font-extrabold cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                  اشحن قلبي بدعاء وتوجيهٍ آخر 🤲🌟
                </button>
              </div>

              {/* CTA Enter Button */}
              <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setHasDismissedStartupDua(true);
                    logActivity('auth', 'بدأ البطل جلسة مذاكرة جديدة بالاستعانة بالله تعالى من خلال شاشة الأدعية 🤲✨');
                  }}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm sm:text-base cursor-pointer shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>بسم الله.. توكلت على الله وبدأت المذاكرة 🚀🎯</span>
                </button>
                <span className="text-[10px] text-slate-400 font-medium">كل ثقة أنك ستصل لحلمك اليوم وكل يوم كبطل حقيقي! 💪</span>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active Subject List helper
  const availableSubjects = SUBJECTS_BY_BRANCH[profile.branch || ''] || [];

  // Completed & Pending Tasks count
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const totalTasksCount = tasks.length;
  const dailyProgressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const filteredTasks = taskFilterSubject === 'all' ? tasks : tasks.filter(t => t.subject === taskFilterSubject);

  // Render main layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* Developer Identification Banner */}
      <div className="bg-slate-900 text-white py-2.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] sm:text-xs font-medium">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border border-white/20 text-[10px]">
              💻
            </div>
            <span className="font-extrabold text-slate-200">إسم المطور : محمد محمود</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <a 
            href="https://wa.me/201031498281" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition font-bold"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>واتساب: 01031498281</span>
          </a>
          <span className="text-slate-700">|</span>
          <a 
            href="https://t.me/+201031498281" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition font-bold"
          >
            <TelegramIcon className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>تيليجرام: 01031498281</span>
          </a>
        </div>
        <div className="text-slate-400 text-[10px] hidden md:block">مطور منصة رفيق الثانوية الذكي 💻✨</div>
      </div>

      {/* Top Professional Header Bar */}
      <header className={`bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
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
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-medium font-sans">
                <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {getFormattedArabicDateValue()}
                </span>
                <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-mono text-amber-600 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  {liveTime}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto justify-center">

            {/* Dark Mode Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 px-3.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-black cursor-pointer shadow-sm shrink-0 ${
                darkMode 
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/35'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
              }`}
              title={darkMode ? "التبديل إلى المظهر المضيء ☀️" : "التبديل إلى الوضع الليلي المريح للعين 🌙"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>الوضع المضيء ☀️</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>الوضع الليلي 🌙</span>
                </>
              )}
            </button>
            
            {/* Student Info Widget */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 px-4 flex items-center gap-3.5">
              {/* Profile Image (Clickable to edit or upload profile picture) */}
              <div className="relative group cursor-pointer shrink-0" onClick={() => setCurrentTab('profile')} title="تعديل بياناتك وصورتك الشخصية">
                <img 
                  src={profile.avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEF3C7"/><text y="70" x="22" font-size="55">👨‍🎓</text></svg>'}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/50 text-[8px] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-b-full py-0.5">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={forceSaveAllData}
                  className="p-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-all font-extrabold text-[10px] flex items-center gap-1.5 shadow-sm"
                  title="حفظ متكامل لكافة البيانات يدوياً لمنع أي ضياع للبينات"
                >
                  حفظ 💾
                </button>
                <div className="p-1 px-2 bg-slate-200 text-slate-600 rounded-lg cursor-pointer hover:bg-slate-300 transition-all font-bold text-[10px]" onClick={() => setCurrentTab('profile')} title="تعديل تخصصك أو الكلية المفضلة">
                  تعديل 📝
                </div>
                <div className="p-1 px-2 bg-rose-50 text-rose-600 rounded-lg cursor-pointer hover:bg-rose-100 transition-all font-bold text-[10px]" onClick={handleLogout} title="تسجيل الخروج والتبديل لحساب آخر">
                  خروج 🚪
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">البطل (المستخدم: {currentUser}):</div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <span className="text-amber-600 font-bold">{profile.title || 'بطل'}/</span>
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
            { id: 'study', label: 'رفيق المذاكرة التفاعلي 📖✨' },
            { id: 'tasks', label: 'لوحة المهام الذكية 📚' },
            { id: 'timer', label: 'مؤقت بومودورو ⏱️' },
            { id: 'vent', label: 'ركن الفضفضة والتأمل 🧠' },
            { id: 'badges', label: 'مكافآتي وشاراتي 🏆' },
            { id: 'profile', label: 'البيانات الشخصية 👤' }
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

        {/* Manual Data Save Confirmation Toast */}
        <AnimatePresence>
          {showSaveSuccess && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md bg-gradient-to-l from-emerald-600 to-teal-500 p-5 rounded-3xl text-white shadow-2xl z-50 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3 text-right" dir="rtl">
                <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base font-display">تم الحفظ الآمن للبيانات! 💾🔐</h4>
                  <p className="text-emerald-50 text-xs mt-1 leading-relaxed font-bold">
                    تم التأكيد وتخزين كل البيانات (الاسم، الشعبة، الهدف، المهام والأوسمة) يدوياً وبشكل دائم على جهازك بنجاح! ستجدها دائمًا كما تركتها.
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowSaveSuccess(false)}
                  className="py-1 px-4 bg-white text-emerald-800 font-bold text-[11px] rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  حسناً يا بطل! 👍
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN TABS ROUTING --- */}
        <div id="tab-holder" className="grid grid-cols-1 gap-8">

          {/* TAB: RAFIQ STUDY */}
          {currentTab === 'study' && profile && (
            <div className="animate-fadeIn">
              <RafiqStudy 
                profile={profile} 
                onAddPoints={(amount) => setPoints(prev => prev + amount)}
                onAddActivityLog={logActivity}
              />
            </div>
          )}

          {/* TAB 1: DASHBOARD & PROGRESS */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Exam Countdown Banner / Date Controller */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6" dir="rtl">
                {/* Decorative background shape */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-amber-50/40 rounded-br-full -z-10" />
                
                <div className="flex items-start gap-4 text-right">
                  <div className="p-4 bg-amber-50 text-amber-600 rounded-3xl hidden sm:flex items-center justify-center shrink-0">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 text-lg font-bold font-display flex items-center gap-2">
                      <span>العد التنازلي للماراثون الكبير 🏆</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-sans font-normal border border-slate-250">ثانوية عامة {new Date().getFullYear()}</span>
                    </h3>
                    
                    {profile?.examDate ? (
                      <div className="space-y-2 mt-1.5 text-right">
                        <p className="text-slate-600 text-sm leading-relaxed">
                          تاريخ أول امتحاناتك تم تحديده يوم <strong className="text-amber-600">{new Date(profile.examDate).toLocaleDateString('ar-EG', { dateStyle: 'long' })}</strong>.
                        </p>
                        {getDaysUntilExam(profile.examDate) !== null && (
                          <div className="bg-gradient-to-l from-orange-50 to-amber-50 border-r-4 border-amber-500 p-3.5 rounded-2xl shadow-sm">
                            <p className="text-slate-800 text-sm font-extrabold leading-loose">
                              🎯 كمل يا بطل فاضلك <strong className="text-orange-600 text-lg font-black font-sans mx-1">{getDaysUntilExam(profile.examDate)} أيام</strong> علي تحقيق حلمك، متشغلش بالك بحد أبداً.. كمل انت قدها متخليش حد يحبطك! 💪🌟
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">لم تقم بتحديد تاريخ أول امتحاناتك بعد. حدده الآن لتشغيل العد التنازلي التلقائي!</p>
                    )}
                    
                    {/* Encouraging dynamic Egyptian message based on remaining days */}
                    <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                      <span>
                        {(() => {
                          const days = getDaysUntilExam(profile?.examDate);
                          if (days === null) return 'خطوة بخطوة يا بطل، بكرة هتوصل لقمة طموحك وتفرح!';
                          if (days > 30) return 'المسافة لسه كويسة وعندك وقت تقفل كل المواد القديمة والجديدة بذكاء! شد الحيل!';
                          if (days > 15) return 'الأيام بتجري لكن البطل ذكي بيعافر في كل دقيقة! كمل بومودورو وضاعف تركيزك هانت!';
                          if (days > 7) return 'أسبوعين على امتحاناتك! المراجعات وحل الامتحانات دلوقتي كنز حقيقي.. اضغط بقوة يا وحش!';
                          if (days > 0) return 'خلاص الامتحانات على الأبواب! أيام قليلة وسينتهي هذا التعب بالفرح القريب! ثق بربي وتوفيقك!';
                          if (days === 0) return 'اليوم هو اليوم الكبير! خذ نفساً عميقاً، اقرأ قرانك وادعُ ربك.. في ضهرك دايماً!';
                          return 'الماراثون بدأ بالفعل! ثق بنفسك في اللجان واصنع كبطل قصتك التاريخية!';
                        })()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
                  <div className="font-mono text-center bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-4 px-6 rounded-2xl w-full sm:w-auto shrink-0">
                    <span className="block text-slate-400 text-[10px] font-sans font-bold uppercase tracking-wider">الأيام المتبقية</span>
                    <span className="text-3 shadow-sm font-extrabold text-orange-600 block text-3xl">
                      {getDaysUntilExam(profile?.examDate) !== null ? getDaysUntilExam(profile?.examDate) : '⏱️'}
                    </span>
                    <span className="block text-[11px] text-slate-500 font-sans mt-0.5 font-bold">يوماً حاسماً</span>
                  </div>

                  {/* Inline Date Modifier Input */}
                  <div className="flex flex-col gap-1.5 w-full sm:w-auto text-right">
                    <label className="text-xs text-slate-500 font-bold block">تغيير تاريخ الامتحانات 📅:</label>
                    <input
                      type="date"
                      value={profile?.examDate || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setProfile({ ...profile!, examDate: e.target.value });
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-none bg-slate-50 font-sans cursor-pointer text-right w-full sm:w-44 font-semibold text-slate-700"
                    />
                  </div>
                </div>
              </div>

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

              {/* TAB 1.5: Recharts Weekly Statistics Section */}
              {(() => {
                const weeklyData = getWeeklyStatsData();
                const totalWeeklyHours = Math.round(weeklyData.reduce((acc, curr) => acc + curr['ساعات المذاكرة المقدرة'], 0) * 10) / 10;
                const totalWeeklyPomodoros = weeklyData.reduce((acc, curr) => acc + curr['جلسات بومودورو المنجزة'], 0);
                const averageDailyHours = Math.round((totalWeeklyHours / 7) * 10) / 10;
                
                return (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100" dir="rtl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5 mb-6">
                      <div className="text-right">
                        <h3 className="text-lg font-extrabold text-slate-800 font-display flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-500 animate-pulse" />
                          <span>تطور مجهودك ومذاكرتك على مدار الأسبوع 📊</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">تتبع مرن ومباشر لساعات تركيزك وجلسات البومودورو المنجزة</p>
                      </div>

                      {/* Switch Controls */}
                      <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0 self-start sm:self-center select-none">
                        <button
                          onClick={() => setStatsMetric('hours')}
                          className={`py-1.5 px-4 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                            statsMetric === 'hours'
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          ساعات المذاكرة ⏱️
                        </button>
                        <button
                          onClick={() => setStatsMetric('pomodoros')}
                          className={`py-1.5 px-4 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                            statsMetric === 'pomodoros'
                              ? 'bg-amber-500 text-white shadow-md'
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          جلسات البومودورو 🔥
                        </button>
                      </div>
                    </div>

                    {/* Metric Summary Widgets Group */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-right flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">مجموع ساعات تركيزك هذا الأسبوع ⏱️</span>
                        <span className="text-2xl font-extrabold text-blue-600 font-mono block leading-none p-1">{totalWeeklyHours} <span className="text-xs font-sans font-bold text-slate-500">ساعة</span></span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-right flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">إجمالي جلسات الـ بومودورو الفعالة 🔥</span>
                        <span className="text-2xl font-extrabold text-amber-600 font-mono block leading-none p-1">{totalWeeklyPomodoros} <span className="text-xs font-sans font-bold text-slate-500">جلسة</span></span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 text-right flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">معدل مذاكرتك اليومي المكافئ 📈</span>
                        <span className="text-2xl font-extrabold text-emerald-600 font-mono block leading-none p-1">{averageDailyHours} <span className="text-xs font-sans font-bold text-slate-500">ساعة / يوم</span></span>
                      </div>
                    </div>

                    {/* Actual Recharts Chart Container */}
                    <div className="h-[280px] sm:h-[340px] w-full pr-1 font-sans" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={weeklyData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={statsMetric === 'hours' ? '#1d4ed8' : '#d97706'} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={statsMetric === 'hours' ? '#1d4ed8' : '#d97706'} stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            fontWeight="semibold"
                            tickLine={false} 
                            axisLine={false}
                            dy={8}
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            fontWeight="semibold"
                            tickLine={false} 
                            axisLine={false}
                            dx={-8}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const val = payload[0].value;
                                return (
                                  <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-3.5 rounded-2xl shadow-xl text-right font-sans" dir="rtl">
                                    <p className="text-xs font-extrabold text-slate-800 mb-1">{label}</p>
                                    <p className="text-xs font-bold" style={{ color: statsMetric === 'hours' ? '#1d4ed8' : '#b45309' }}>
                                      <span>{statsMetric === 'hours' ? 'ساعات المذاكرة المقدرة' : 'جلسات بومودورو المنجزة'}: </span>
                                      <span className="font-mono text-sm font-extrabold">{val}</span>
                                      <span> {statsMetric === 'hours' ? 'ساعة' : 'جلسة'}</span>
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey={statsMetric === 'hours' ? 'ساعات المذاكرة المقدرة' : 'جلسات بومودورو المنجزة'} 
                            stroke={statsMetric === 'hours' ? '#2563eb' : '#d97706'} 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorMetric)" 
                            activeDot={{ r: 6, strokeWidth: 0 }} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Encouraging Feedback based on hours */}
                    <div className="mt-4 bg-amber-50/40 border border-amber-100/50 p-4 rounded-2xl text-right">
                      <p className="text-xs text-amber-800 font-bold leading-relaxed flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-550 shrink-0" />
                        <span>
                          {totalWeeklyHours >= 15
                            ? `يا الله على روعتك يا ${profile?.name || 'بطل'}! أنجزت أكثر من 15 ساعة مذاكرة مركزة هذا الأسبوع. أنت تضع أساساً متيناً لدخول ${profile?.dreamCollege || 'القمة'}. استمر بنظام بومودورو المذهل!`
                            : totalWeeklyHours >= 5
                            ? `أداء متزن وجميل يا ${profile?.name || 'بطل'}.. نقترب يومياً من القمة خطوة بخطوة. شد الهمة لرفع الساعات أكثر غداً ونظم بريك البومودورو!`
                            : `سجلت حتى الآن بداية جيدة يا ${profile?.name || 'بطل'}! المذاكرة بومودورو بومودورو تسهل الصعب وتعمر جدول الأسبوع بالنجاحات.. ابدأ أول دورة تركيز الآن!`}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })()}

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

              {/* Group Study Challenges & Leaderboard Section */}
              <GroupChallenges 
                userWeeklyPomodoros={getWeeklyStatsData().reduce((acc, curr) => acc + curr['جلسات بومودورو المنجزة'], 0)}
                userName={profile?.name || 'بطل'}
                userBranch={profile?.branch || 'science'}
                onAddPoints={(amount) => setPoints(prev => prev + amount)}
                onAddActivityLog={logActivity}
              />

              {/* Subject Mind Map Section */}
              <SubjectMindMap branch={profile.branch} tasks={tasks} />

              {/* Activity Log Feed Section */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8" dir="rtl">
                <div className="flex items-center justify-between mb-5 select-none">
                  <h3 className="text-lg font-extrabold text-slate-800 font-display flex items-center gap-2.5">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span>لوحة النشاط التاريخي ومسيرة البطل 📜</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">سجل الأنشطة المحفوظ تلقائياً</span>
                </div>

                {activityLogs && activityLogs.length > 0 ? (
                  <div className="relative border-r-2 border-slate-100 pr-5 mr-1.5 space-y-4 py-2 max-h-96 overflow-y-auto">
                    {activityLogs.map((log) => {
                      return (
                        <div key={log.id} className="relative flex items-start gap-3 text-right">
                          {/* Dot item indicator icon */}
                          <div className={`absolute -right-[24px] top-1.5 w-3.3 h-3.3 rounded-full border-2 ${
                            log.type === 'auth' ? 'bg-indigo-500 border-indigo-100' :
                            log.type === 'task_complete' ? 'bg-emerald-500 border-emerald-100' :
                            log.type === 'task_add' ? 'bg-orange-400 border-orange-100' :
                            log.type === 'pomodoro' ? 'bg-amber-500 border-amber-100' :
                            log.type === 'badge_unlock' ? 'bg-yellow-500 border-yellow-100' : 'bg-pink-500 border-pink-100'
                          } w-3 h-3`} />
                          
                          <div className="bg-slate-50 rounded-2xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full border border-slate-100">
                            <span className="text-xs font-semibold text-slate-700 leading-relaxed">{log.description}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold shrink-0 self-end sm:self-center bg-white px-2 py-0.5 rounded-md border border-slate-100/50">{log.timestamp}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400">لا توجد سجلات أنشطة لعرضها حتى الآن يا بطل. ابدأ المذاكرة والإنجاز لشحن همتك!</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: TASK BOARD MANAGEMENT */}
          {currentTab === 'tasks' && (
            <div className="space-y-8 animate-fadeIn">
              {(() => {
                const activeDeepFocusTask = tasks.find(t => t.id === deepFocusTaskId && !t.isCompleted);
                if (activeDeepFocusTask) {
                  return (
                    <DeepFocusView 
                      task={activeDeepFocusTask}
                      onClose={() => setDeepFocusTaskId(null)}
                      onComplete={(id) => {
                        handleToggleTask(id);
                        setDeepFocusTaskId(null);
                      }}
                      notificationsEnabled={profile?.notificationsEnabled}
                    />
                  );
                }
                return (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form to add tasks */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit">
                  <h3 className="text-lg font-bold text-slate-800 font-display mb-4">إنشاء مهمة دراسية جديدة ✨</h3>
                  
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs text-slate-400 font-bold">ماذا تريد أن تذاكر وتحل؟</label>
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="مثال: مراجعة الباب الثاني كيمياء..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="w-full p-4 pr-12 rounded-xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none text-sm transition font-semibold"
                          maxLength={80}
                        />
                        <button
                          type="button"
                          onClick={handleStartVoiceNote}
                          disabled={isRecording}
                          title="تسجيل المهمة بصوتك 🎙️"
                          className={`absolute right-2 top-2 p-2 rounded-lg transition-all border flex items-center justify-center ${
                            isRecording 
                              ? 'bg-rose-50 text-rose-500 border-rose-200 animate-pulse' 
                              : 'bg-slate-50 text-slate-400 hover:text-amber-600 border-slate-100 hover:border-amber-200'
                          } cursor-pointer shadow-sm`}
                        >
                          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {voiceFeedback && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`text-[10px] font-bold mt-1.5 px-3 py-1.5 rounded-lg border text-right transition-colors ${
                              voiceFeedback.includes('❌') || voiceFeedback.includes('🚫')
                                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}
                          >
                            {voiceFeedback}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold font-display">تبعاً لأي مادة دراسية؟</label>
                      <select
                        value={newTaskSubject}
                        onChange={(e) => setNewTaskSubject(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none text-sm transition bg-white font-bold text-slate-700"
                      >
                        <option value="">-- اختر مادة --</option>
                        {availableSubjects.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                        <option value="تطوير عام">تطوير عام وتحفيز</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {newTaskSubject && (SUBJECT_STUDY_TIPS[newTaskSubject] || SUBJECT_STUDY_TIPS[newTaskSubject === 'تطوير عام' ? 'تطوير عام' : '']) && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -8 }}
                          className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-right overflow-hidden shadow-inner"
                        >
                          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1">
                            <span className="block text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none">💡 نصيحة دراسية سريعة للمادة:</span>
                            <p className="text-xs text-amber-900 font-extrabold leading-relaxed pr-0">
                              {SUBJECT_STUDY_TIPS[newTaskSubject] || SUBJECT_STUDY_TIPS['تطوير عام']}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-display">مهامك وجدولك اليومي</h3>
                      <p className="text-xs text-slate-400 mt-0.5">قسم المواد الكبيرة لخطوات بسيطة لتفادي الضغط الدراسي</p>
                    </div>
                    
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full shrink-0">
                      تم إنجاز {completedTasksCount} / {totalTasksCount}
                    </span>
                  </div>

                  {/* Subject Filter & Tips Section */}
                  <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-b-slate-100 pb-4 overflow-x-auto scrollbar-none" dir="rtl">
                    <span className="text-[11px] font-black text-slate-400 shrink-0 select-none">تصفية حسب:</span>
                    <button
                      type="button"
                      onClick={() => setTaskFilterSubject('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        taskFilterSubject === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/15 border border-indigo-600'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      الجميع 🌐
                    </button>
                    {availableSubjects.map((sub) => {
                      const subjectTasksCount = tasks.filter(t => t.subject === sub).length;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setTaskFilterSubject(sub)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                            taskFilterSubject === sub
                              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/15 border border-amber-500'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                          }`}
                        >
                          <span>{sub}</span>
                          {subjectTasksCount > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-black ${
                              taskFilterSubject === sub ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {subjectTasksCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setTaskFilterSubject('تطوير عام')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border whitespace-nowrap ${
                        taskFilterSubject === 'تطوير عام'
                          ? 'bg-amber-500 text-white shadow-sm border-amber-500'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100'
                      }`}
                    >
                      تطوير عام 🚀
                    </button>
                  </div>

                  {/* Dynamic study tips banner for selected subject */}
                  <AnimatePresence mode="wait">
                    {taskFilterSubject !== 'all' && SUBJECT_STUDY_TIPS[taskFilterSubject] && (
                      <motion.div
                        key={taskFilterSubject}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-5 p-4.5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/15 rounded-2xl flex items-start gap-3.5 text-right relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 w-24 h-24 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full pointer-events-none" />
                        <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
                          <Lightbulb className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-amber-600 tracking-wider uppercase leading-none">مستشار رفيق الثانوية 🩺🎓</span>
                          <h4 className="text-xs font-black text-slate-800">نصيحة ذهبية لمذاكرة مادة: {taskFilterSubject}</h4>
                          <p className="text-xs font-bold text-slate-600 leading-relaxed pt-1">{SUBJECT_STUDY_TIPS[taskFilterSubject]}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {filteredTasks.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                      <Calendar className="w-12 h-12 text-slate-200" />
                      <p className="text-sm font-medium">
                        {taskFilterSubject === 'all' 
                          ? 'جدولك لليوم فارغ وحالياً مريح يا بطل.' 
                          : `لا توجد مهام حالياً لمادة: ${taskFilterSubject}`}
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs">
                        {taskFilterSubject === 'all'
                          ? 'ابدأ بإدخال الدروس المطلوب مذاكرتها ليقوم التطبيق بتقسيمها وتشجيعك عند الإنجاز!'
                          : `اضغط على "إضافة للمهام اليومية" في اليمين بعد اختيار مادة "${taskFilterSubject}" لتسجيل درس جديد!`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
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

                          <div className="flex items-center gap-2 shrink-0">
                            {!task.isCompleted && (
                              <button
                                onClick={() => setDeepFocusTaskId(task.id)}
                                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition duration-200 cursor-pointer flex items-center gap-1.5 border border-indigo-100/50"
                                title="بدء وضع التركيز العميق لهذه المهمة 🧘‍♂️"
                              >
                                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                                <span>تركيز عميق 🧘‍♂️</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                              title="حذف المهمة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

                    {/* Hero's Notes/Diaries Section - Moved to Tasks for better organization */}
                    <HeroNotes currentUser={currentUser} />
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 3: FOCUS TIMER SCREEN (POMODORO) */}
          {currentTab === 'timer' && (
            <div className="max-w-xl mx-auto space-y-8 animate-fadeIn">
              <FocusTimer 
                onPomoComplete={handlePomoComplete} 
                studentName={profile.name} 
                notificationsEnabled={profile.notificationsEnabled}
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

          {currentTab === 'profile' && (
            <ProfileTab currentProfile={profile} onSave={handleProfileSave} />
          )}

        </div>

      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-100 mt-12 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 رفيق الثانوية العامة الذكي. جميع الحقوق لكل الطلاب الأبطال.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-slate-600 font-bold">
            <span className="text-slate-500 font-medium">تواصل مع المطور (محمد محمود):</span>
            <a 
              href="https://wa.me/201031498281" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 transition"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>واتساب: 01031498281</span>
            </a>
            <a 
              href="https://t.me/+201031498281" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 transition"
            >
              <TelegramIcon className="w-3.5 h-3.5 fill-current" />
              <span>تيليجرام: 01031498281</span>
            </a>
          </div>

          <p className="flex items-center gap-1.5">
            صُنع بحب ودعم لطلاب البكالوريا ومستقبل الأمة العربية 💡🎓
          </p>
        </div>
      </footer>

    </div>
  );
}
