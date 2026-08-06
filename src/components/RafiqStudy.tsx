import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Clock, 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Lightbulb, 
  ArrowLeft, 
  Volume2, 
  Flame,
  ArrowRight,
  BookMarked,
  Info,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Loader2
} from 'lucide-react';
import { StudentProfile } from '../types';

interface RafiqStudyProps {
  profile: StudentProfile;
  onAddActivityLog: (type: any, desc: string) => void;
  onAddPoints: (points: number) => void;
}

interface Lesson {
  id: string;
  subject: string;
  title: string;
  explanation: {
    title: string;
    content: string;
    subPoints: { title: string; text: string }[];
  };
  audioGuide: {
    title: string;
    duration: string;
    speaker: string;
  };
  takeaways: string[];
  flashcards: {
    front: string;
    back: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

const MOTIVATIONAL_STEPS = [
  "جارِ شرب الشاي مع رفيقك وحساب المسائل... ☕",
  "بقرأ الورق والمنهج كلمة كلمة عشان أبسطهالك خالص... 🔬",
  "بعملّك أسئلة بابل شيت ذكية متفصلة على مدار تفكيرك... 📐🧠",
  "بيتم استخلاص أهم كبسولات الـ Key Takeaways والبطاقات... 🏆",
  "متقلقش يا بطل، الدرس هيكون في جيبك ثواني ومخلصين... 🔥✨"
];

const AVAILABLE_SUBJECTS = [
  "الفيزياء ⚡",
  "الكيمياء 🧪",
  "الأحياء 🧬",
  "الرياضيات 📐",
  "اللغة العربية 📜",
  "اللغة الإنجليزية 🇬🇧",
  "التاريخ والجغرافيا 🌍",
  "مادة أخرى 🎓"
];

export default function RafiqStudy({ profile, onAddActivityLog, onAddPoints }: RafiqStudyProps) {
  // Library of generated lessons
  const [generatedLessons, setGeneratedLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Custom generation inputs
  const [customSubject, setCustomSubject] = useState<string>("الفيزياء ⚡");
  const [activeInputTab, setActiveInputTab] = useState<'image' | 'text'>('image');
  
  // Image state
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>('');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('');
  
  // Text state
  const [pastedText, setPastedText] = useState<string>('');
  
  // Loading & error states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStep, setGeneratingStep] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');

  // Active sub-tab inside the opened lesson
  const [activeTab, setActiveTab] = useState<'explanation' | 'flashcards' | 'quiz'>('explanation');
  
  // Interactive lesson states
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({ 0: true });
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  
  // Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [earnedBonus, setEarnedBonus] = useState(false);

  // Load registered lessons from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rafiq_generated_lessons');
    if (saved) {
      try {
        setGeneratedLessons(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved lessons:", e);
      }
    }
  }, []);

  // Interval rotation for loading state text
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setGeneratingStep(prev => (prev + 1) % MOTIVATIONAL_STEPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Mock audio progress simulator (smart fallback when not speaking or speaking is done)
  useEffect(() => {
    let interval: any;
    const hasSpeech = 'speechSynthesis' in window;
    
    if (audioPlaying && (!hasSpeech || !window.speechSynthesis.speaking)) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setAudioPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [audioPlaying]);

  // Cleanup speech synthesis on change of lesson, tab, or on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioPlaying(false);
    setAudioProgress(0);
  }, [selectedLesson, activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      setUploadError('حجم المستند كبير جداً يا بطل! يرجى رفع ملف أو صورة أقل من 500 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setUploadedImageBase64(base64Data);
      setUploadedImagePreview(base64String);
      setUploadedImageName(file.name);
      setMimeType(file.type);
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateLesson = async () => {
    if (activeInputTab === 'image' && !uploadedImageBase64) {
      setUploadError('الرجاء اختيار صورة لصفحة المنهج أولاً يا بطل!');
      return;
    }
    if (activeInputTab === 'text' && !pastedText.trim()) {
      setUploadError('الرجاء كتابة أو لصق مفهوم أو شرح درس أولاً يا بطل!');
      return;
    }

    setIsGenerating(true);
    setUploadError('');
    setGeneratingStep(0);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: activeInputTab === 'image' ? uploadedImageBase64 : undefined,
          mimeType: activeInputTab === 'image' ? mimeType : undefined,
          textContent: activeInputTab === 'text' ? pastedText : undefined,
          studentProfile: profile
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'عذراً يا بطل! حدث خطأ أثناء الاتصال بالرفيق الذكي لتوليد الدرس. حاول مجدداً!');
      }

      const data = await response.json();
      if (!data.lesson) {
        throw new Error('لم يتمكن الرفيق من استخلاص الدرس بالكامل.');
      }

      // Append subject info to the new generated lesson
      const newLesson: Lesson = {
        ...data.lesson,
        subject: customSubject
      };

      const updatedList = [newLesson, ...generatedLessons];
      setGeneratedLessons(updatedList);
      localStorage.setItem('rafiq_generated_lessons', JSON.stringify(updatedList));

      // Trigger active points
      onAddPoints(20);
      onAddActivityLog(
        'badge_unlock', 
        `أنت أسطورة! قمت برفع مستند درسك وتوليد مادة تفاعلية مذهلة: "${newLesson.title}" بنجاح! (+20 نقطة) 🚀✨`
      );

      // Instantly open the lesson!
      setSelectedLesson(newLesson);
      setActiveTab('explanation');
      resetLessonStates();

      // Clear inputs
      setUploadedImageBase64('');
      setUploadedImagePreview('');
      setUploadedImageName('');
      setPastedText('');

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'فشلت عملية التحليل والتوليد، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteLesson = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس من مكتبتك يا بطل؟')) return;

    const filtered = generatedLessons.filter(l => l.id !== lessonId);
    setGeneratedLessons(filtered);
    localStorage.setItem('rafiq_generated_lessons', JSON.stringify(filtered));

    if (selectedLesson?.id === lessonId) {
      setSelectedLesson(null);
    }

    onAddActivityLog('task_complete', 'قمت بحذف درس من مكتبتك التفاعلية الخاصة 🗑️');
  };

  const resetLessonStates = () => {
    setOpenAccordions({ 0: true });
    setAudioPlaying(false);
    setAudioProgress(0);
    setFlippedCardIdx(null);
    setCurrentCardIdx(0);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setEarnedBonus(false);
  };

  const handleToggleAudio = () => {
    if (!selectedLesson) return;
    
    if ('speechSynthesis' in window) {
      if (audioPlaying) {
        window.speechSynthesis.cancel();
        setAudioPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        
        // Let's build detailed explanations of lesson and its subpoints
        let readText = `${selectedLesson.audioGuide?.title || selectedLesson.title}. `;
        readText += `الشرح العام للدرس: ${selectedLesson.explanation.content}. `;
        
        if (selectedLesson.explanation.subPoints && selectedLesson.explanation.subPoints.length > 0) {
          readText += `دعنا نقسم الفهم إلى مفاتيح ذكية. `;
          selectedLesson.explanation.subPoints.forEach((pt, idx) => {
            readText += `المفتاح رقم ${idx + 1}: ${pt.title}. الشرح التفصيلي للمفتاح: ${pt.text}. `;
          });
        }
        
        if (selectedLesson.takeaways && selectedLesson.takeaways.length > 0) {
          readText += `أهم خمسة خلاصات من رفيقك للمذاكرة والامتحان هي كالتالي: `;
          selectedLesson.takeaways.forEach((tk, idx) => {
            readText += `الخلاصة رقم ${idx + 1}: ${tk}. `;
          });
        }
        
        readText += `أتمنى لك كل التوفيق والتركيز يا بطل الثانوية العامة! أنت قادر على تحطيم الصعاب والوصول للقمة!`;

        const utterance = new SpeechSynthesisUtterance(readText);
        utterance.lang = 'ar-EG';
        
        // Find best Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => v.lang.includes('ar'));
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        utterance.rate = 0.95; // slightly slower for premium clarity
        
        setAudioProgress(0);
        
        utterance.onboundary = (e) => {
          if (readText.length > 0) {
            const ratio = Math.min(100, Math.round((e.charIndex / readText.length) * 100));
            setAudioProgress(ratio);
          }
        };
        
        utterance.onend = () => {
          setAudioPlaying(false);
          setAudioProgress(105); // Completed
        };
        
        utterance.onerror = (err) => {
          console.error("SpeechSynthesisUtterance error:", err);
          setAudioPlaying(false);
        };

        setAudioPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Fallback
      setAudioPlaying(!audioPlaying);
    }
  };

  const handleChangeSubTab = (tab: 'explanation' | 'flashcards' | 'quiz') => {
    setActiveTab(tab);
    setFlippedCardIdx(null);
    if (tab === 'quiz' && !quizFinished) {
      setSelectedOptionIdx(null);
      setQuizSubmitted(false);
    }
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOptionIdx(optionIdx);
  };

  const handleQuizSubmit = () => {
    if (selectedOptionIdx === null || !selectedLesson) return;
    setQuizSubmitted(true);
    const correctIdx = selectedLesson.quiz[currentQuestionIdx].correctIndex;
    if (selectedOptionIdx === correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (!selectedLesson) return;
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < selectedLesson.quiz.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionIdx(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      if (!earnedBonus) {
        onAddPoints(15);
        onAddActivityLog(
          'task_complete', 
          `أنجزت الاختبار التفاعلي للدرس التوليدي "${selectedLesson.title}" وحصدت 15 نقطة طاقة إضافية ممتازة! 🎓🔥`
        );
        setEarnedBonus(true);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl" id="rafiq-study-main">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/25 border border-indigo-500/30 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
              <span className="text-[10px] font-black text-indigo-200 tracking-wider uppercase">رفيق المذاكرة وباني الاختبارات الذكي 📖✨</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              صانع الامتحانات والشروح بالذكاء الاصطناعي!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              ارفع صورة أو صفحة من كتاب مادتك (أو الصق النص مباشرة)، وسيقوم "الرفيق" بمساعدتك على فهم الدرس، توليد بطاقات للمراجعة السريعة وتصميم امتحان تفاعلي (MCQs) فوري!
            </p>
          </div>

          <div className="flex gap-4 shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 self-start md:self-center">
            <div className="text-center px-1">
              <span className="block text-[9px] font-bold text-slate-400">الكلية المستهدفة</span>
              <span className="text-sm font-black text-amber-400 mt-1 block">
                {profile.dreamCollege || 'القمة'} 🎓
              </span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center px-1">
              <span className="block text-[9px] font-bold text-slate-400">شعبة البطل</span>
              <span className="text-sm font-black text-indigo-300 mt-1 block">
                {profile.branch === 'science' ? 'علمي علوم 🧬' : profile.branch === 'math' ? 'علمي رياضة 📐' : 'أدبي 📜'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Study Flow layout */}
      {!selectedLesson ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Input / Generation Pane: Upload file or paste text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="text-right">
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    <span>توليد درس وامتحان جديد 💡</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">صنّع مادة المذاكرة والاختبار بدقيقة واحدة</p>
                </div>

                {/* Subject Selector dropdown */}
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[10px] font-black text-slate-400">تصنيف المادة</span>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 outline-none cursor-pointer transition-all"
                  >
                    {AVAILABLE_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setActiveInputTab('image'); setUploadError(''); }}
                  className={`py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeInputTab === 'image'
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  <span>رفع صورة صفحة المنهج 📸</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveInputTab('text'); setUploadError(''); }}
                  className={`py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeInputTab === 'text'
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>كتابة أو نسخ المفهوم ✍️</span>
                </button>
              </div>

              {/* Input areas */}
              <div className="min-h-[220px] flex flex-col justify-center">
                {activeInputTab === 'image' ? (
                  /* IMAGE UPLOADER */
                  <div className="space-y-4">
                    {!uploadedImagePreview ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:bg-indigo-50/20 hover:border-indigo-300 transition-all cursor-pointer text-center group">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-slate-800">اضغط هنا أو اسحب صورة الكتاب أو ملف PDF لتصويره</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-1.5">نقبل صور ومستندات PNG, JPG, JPEG, WEBP, PDF حتى 500 ميجابايت</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      /* IMAGE/PDF PREVIEW SCREEN */
                      <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 flex flex-col items-center justify-center p-8 w-full">
                        {mimeType === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center space-y-3 py-6">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                              <FileText className="w-10 h-10" />
                            </div>
                            <span className="text-xs font-black text-slate-850 text-center max-w-xs truncate">
                              {uploadedImageName}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-black">جاهز للتحليل والامتحان 📑✨</span>
                          </div>
                        ) : (
                          <img 
                            src={uploadedImagePreview} 
                            alt="Curriculum Page Preview" 
                            className="max-h-56 object-contain rounded-xl shadow-md"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedImageBase64('');
                            setUploadedImagePreview('');
                            setUploadedImageName('');
                          }}
                          className="absolute top-3 right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-all cursor-pointer"
                          title="حذف الملف"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-bold text-slate-700 shadow-sm max-w-[200px] truncate">
                          {uploadedImageName}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* TEXT AREA INPUT */
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">الصق أو اكتب فقرة شرح الدرس هنا من ملفك (PDF أو وورد):</span>
                    <textarea
                      placeholder="مثال: ظاهرة كومتون هي ظاهرة تشتت فوتونات الأشعة السينية عند اصطدامها بإلكترون حر، حيث يقل تردد الفوتون وتزداد طاقة حركة الإلكترون..."
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      className="w-full h-44 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none text-xs font-bold leading-relaxed shadow-inner bg-slate-50/50 resize-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>

              {/* PDF Helpful Banner Note */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/15 rounded-2xl flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-900 font-bold leading-normal">
                  <b>ملاحظة ذكية:</b> إذا كان لديك مستند <b>PDF أو كراسة شرح</b>، يرجى تصفحها ونسخ المقطع الذي تريد تلخيصه، لتلصقه كـ "نص"، أو ببساطة التقط لقطة شاشة (Screenshot) لصفحة كتابك وارفعها كصورة!
                </p>
              </div>

              {/* Error messages if any */}
              {uploadError && (
                <div className="p-3 bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-black">
                  {uploadError}
                </div>
              )}

              {/* Submit trigger */}
              <button
                type="button"
                onClick={handleGenerateLesson}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-indigo-600/10 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all border border-indigo-500/10"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>الرفيق يقوم بصناعة الدرس ذهنياً حالياً...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" />
                    <span>توليد الشرح المبسط والاختبار الآن ✨</span>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Left Bookshelf Pane: List of generated lessons */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Generating Loading Visualizer */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-3xl p-6 text-center space-y-4 shadow-sm"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-900">جارِ تفكيك وفهم المنهج بدقة 🔮✨</h4>
                  <p className="text-xs text-amber-700 font-bold">يرجى الانتظار لصياغة الشروح والبطاقات والأسئلة...</p>
                </div>
                <div className="pt-2 border-t border-amber-200/50">
                  <motion.p 
                    key={generatingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs font-black text-amber-800 italic"
                  >
                    "{MOTIVATIONAL_STEPS[generatingStep]}"
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Custom Shelf Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <BookMarked className="w-4.5 h-4.5 text-indigo-500" />
                  <span>مكتبة الدروس الموّلدة الخاصة بك ({generatedLessons.length})</span>
                </span>
                {generatedLessons.length > 1 && (
                  <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded">مخصصة</span>
                )}
              </div>

              {generatedLessons.length === 0 ? (
                /* Empty state */
                <div className="p-8 text-center space-y-3.5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white text-slate-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-600">مكتبتك التفاعلية فارغة حالياً</h4>
                    <p className="text-[10px] text-slate-400 font-semibold max-w-[200px] mx-auto">ارفع أول صفحة كتاب لتأسيس أول درس ومراجعة وامتحان!</p>
                  </div>
                </div>
              ) : (
                /* Saved Lessons list */
                <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                  {generatedLessons.map((les) => (
                    <div
                      key={les.id}
                      onClick={() => { setSelectedLesson(les); resetLessonStates(); }}
                      className="group w-full text-right p-4 rounded-2xl border border-slate-100/80 bg-white hover:border-indigo-150 hover:bg-slate-50/40 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 truncate flex-1 text-right">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-block text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {les.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">بمجموع {les.quiz.length} أسئلة</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {les.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteLesson(les.id, e)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                          title="حذف الدرس"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronLeft className="w-4.5 h-4.5 text-slate-350 transform group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* If a Custom Lesson is Selected, Show the Studying Pane */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Breadcrumb back button */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="study-breadcrumbs">
            <button 
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-black rounded-xl border border-slate-200 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمكتبة وصانع الامتحانات 📚</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{selectedLesson.subject} 📖</span>
              <h3 className="text-base font-black text-slate-800">{selectedLesson.title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar quick list */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
                  <span>الدروس المتاحة في مكتبتك ({generatedLessons.length}):</span>
                </span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {generatedLessons.map((les) => {
                  const isCurSelected = selectedLesson?.id === les.id;
                  return (
                    <button
                      key={les.id}
                      onClick={() => { setSelectedLesson(les); resetLessonStates(); }}
                      className={`w-full text-right p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isCurSelected 
                          ? 'bg-gradient-to-r from-indigo-50/80 to-indigo-100/50 border-indigo-300 shadow-sm'
                          : 'bg-slate-50/30 border-slate-100 hover:border-slate-200 hover:bg-slate-100/40'
                      }`}
                    >
                      <span className="text-[9px] font-bold text-indigo-600 block">{les.subject}</span>
                      <h4 className={`text-xs font-black ${isCurSelected ? 'text-indigo-900' : 'text-slate-800'} truncate w-full`}>
                        {les.title}
                      </h4>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-900 font-bold leading-normal">
                  <b>نصيحة المذاكرة:</b> خذ دقيقتين لقراءة الشرح المبسط والذكي، ثم اختبر معلوماتك في شاشة الـ Quiz لتنشيط ذكائك وحصد النقاط والملاحظات!
                </p>
              </div>
            </div>

            {/* Main Interactive studying board */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                
                {/* Tabs to toggle tabs */}
                <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{selectedLesson.subject}</span>
                    <h3 className="text-base font-black text-slate-800 leading-tight truncate">{selectedLesson.title}</h3>
                  </div>

                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => handleChangeSubTab('explanation')}
                      className={`px-3.5 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                        activeTab === 'explanation'
                          ? 'bg-white text-indigo-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      شرح مبسط 📝
                    </button>
                    <button
                      onClick={() => handleChangeSubTab('flashcards')}
                      className={`px-3.5 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                        activeTab === 'flashcards'
                          ? 'bg-white text-indigo-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      بطاقات المراجعة 🧠
                    </button>
                    <button
                      onClick={() => handleChangeSubTab('quiz')}
                      className={`px-3.5 py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                        activeTab === 'quiz'
                          ? 'bg-white text-indigo-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      اختبار ميمي ⏱️ ({selectedLesson.quiz.length}Q)
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT: Explanation */}
                {activeTab === 'explanation' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                      
                      {/* Simulated Voice lecture */}
                      {selectedLesson.audioGuide && (
                        <div className="bg-gradient-to-r from-indigo-50/40 via-slate-50 to-indigo-50/50 border border-slate-200 rounded-[2rem] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 text-right">
                            <div className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
                              {audioPlaying ? (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.2 }}
                                >
                                  <Volume2 className="w-5 h-5 text-white" />
                                </motion.div>
                              ) : (
                                <Volume2 className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black text-indigo-600 block uppercase leading-none">تأسيس صوتي سريع للدرس 🎙️🔊</span>
                              <h4 className="text-xs font-extrabold text-slate-800 leading-tight">{selectedLesson.audioGuide.title}</h4>
                              <span className="text-[10px] text-slate-400 font-bold block">مُلقي الدرس المقترح: {selectedLesson.audioGuide.speaker}</span>
                            </div>
                          </div>

                          <button
                            onClick={handleToggleAudio}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                              audioPlaying 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                : 'bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200'
                            }`}
                          >
                            {audioPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5 fill-white" />
                                <span>إيقاف مؤقت</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-indigo-600" />
                                <span>استماع للشرح</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* simulated audio progress bar */}
                      {audioPlaying && (
                        <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-3 flex items-center justify-between gap-4 text-xs font-bold font-sans text-indigo-800">
                          <span className="text-slate-450 select-none">0:{(audioProgress/100*22).toFixed(0).padStart(2,'0')}</span>
                          <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${audioProgress}%` }}
                              className="h-full bg-indigo-600 transition-all duration-300"
                            />
                          </div>
                          <span className="text-indigo-600 select-none">{selectedLesson.audioGuide.duration}</span>
                        </div>
                      )}

                      {/* Main explainer block */}
                      <div className="space-y-3">
                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
                          <Info className="w-5 h-5 text-indigo-500" />
                          <span>{selectedLesson.explanation.title}</span>
                        </h4>
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold border-r-2 border-indigo-100 pr-3.5 py-1">
                          {selectedLesson.explanation.content}
                        </div>
                      </div>

                      {/* subPoints accordions */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">مفاتيح الفهم التفاعلي (اضغط لاكتشاف الشرح):</span>
                        {selectedLesson.explanation.subPoints.map((point, i) => {
                          const isOpen = !!openAccordions[i];
                          return (
                            <div
                              key={i}
                              className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors bg-slate-50/50"
                            >
                              <button
                                onClick={() => toggleAccordion(i)}
                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 transition-colors text-right cursor-pointer"
                              >
                                <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                                  <span className="w-5 h-5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full flex items-center justify-center font-black">
                                    {i + 1}
                                  </span>
                                  <span>{point.title}</span>
                                </span>
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                )}
                              </button>

                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-50"
                                  >
                                    <div className="p-4 text-xs font-semibold text-slate-600 leading-relaxed bg-white">
                                      {point.text}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TAB CONTENT: Flashcards */}
                {activeTab === 'flashcards' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Bullet takeaways */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <div className="text-right">
                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                          <Flame className="w-4.5 h-4.5 text-amber-500" />
                          <span>الكبسولات الثلاثية الذهبية للدرس:</span>
                        </h4>
                        <p className="text-xs text-slate-400 font-bold mt-1">تنبيهات عقلية مدهشة تتصدى للفخاخ وحفظ المفاهيم</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                        {selectedLesson.takeaways.map((takeaway, i) => (
                          <div 
                            key={i} 
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-[9px] font-black shrink-0 mt-0.5">
                              {i+1}
                            </span>
                            <p className="text-xs text-slate-600 font-bold leading-relaxed">{takeaway}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flipping 3D Cards */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                      <div className="text-center space-y-1">
                        <h4 className="text-sm font-black text-slate-800">مذاكرة البطاقات والقلب الذاتي 🧠📚</h4>
                        <p className="text-[11px] text-slate-400 font-bold">اضغط على البطاقة لقلبها واختبار معلوماتك</p>
                      </div>

                      {selectedLesson.flashcards && selectedLesson.flashcards.length > 0 ? (
                        <div className="flex flex-col items-center gap-6">
                          
                          <div 
                            className="w-full max-w-sm h-60 cursor-pointer relative"
                            style={{ perspective: '1000px' }}
                            onClick={() => setFlippedCardIdx(flippedCardIdx === currentCardIdx ? null : currentCardIdx)}
                          >
                            <motion.div
                              animate={{ rotateY: flippedCardIdx === currentCardIdx ? 180 : 0 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              style={{ transformStyle: 'preserve-3d' }}
                              className="w-full h-full relative"
                            >
                              {/* FRONT */}
                              <div 
                                style={{ backfaceVisibility: 'hidden' }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-50/70 via-white to-slate-50 border border-slate-200 rounded-2.5rem p-6 flex flex-col justify-between text-center select-none shadow-sm"
                              >
                                <div className="flex justify-between items-center w-full text-slate-400 text-[10px] font-bold">
                                  <span className="bg-indigo-100/60 text-indigo-700 px-3 py-1 rounded-full">سؤال المذاكرة 🤔</span>
                                  <span>بطاقة {currentCardIdx + 1} من {selectedLesson.flashcards.length}</span>
                                </div>

                                <div className="my-auto px-2">
                                  <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-normal">
                                    "{selectedLesson.flashcards[currentCardIdx].front}"
                                  </p>
                                </div>

                                <div className="text-[10px] font-black text-indigo-600 animate-pulse">
                                  اضغط على البطاقة لمعرفة الحل 🔄
                                </div>
                              </div>

                              {/* BACK */}
                              <div 
                                style={{ 
                                  backfaceVisibility: 'hidden',
                                  transform: 'rotateY(180deg)'
                                }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-bl from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-700 rounded-2.5rem p-6 flex flex-col justify-between text-center text-white"
                              >
                                <div className="flex justify-between items-center w-full text-[10px] font-bold">
                                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">السر والحل الذكي 💡✅</span>
                                  <span className="text-slate-450">بطاقة {currentCardIdx + 1} من {selectedLesson.flashcards.length}</span>
                                </div>

                                <div className="my-auto px-2 overflow-y-auto max-h-32 scrollbar-none">
                                  <p className="text-xs sm:text-sm font-bold leading-relaxed text-indigo-100">
                                    {selectedLesson.flashcards[currentCardIdx].back}
                                  </p>
                                </div>

                                <div className="text-[9px] font-bold text-indigo-300">
                                  اضغط للقلب للوجه الأول مجدداً 🔄
                                </div>
                              </div>

                            </motion.div>
                          </div>

                          {/* Controller bots */}
                          <div className="flex items-center gap-6">
                            <button
                              type="button"
                              disabled={currentCardIdx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFlippedCardIdx(null);
                                setCurrentCardIdx(prev => Math.max(0, prev - 1));
                              }}
                              className="p-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-full border border-slate-200 transition cursor-pointer"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>

                            <span className="text-xs font-black text-slate-700 min-w-16 text-center font-sans">
                              {currentCardIdx + 1} / {selectedLesson.flashcards.length}
                            </span>

                            <button
                              type="button"
                              disabled={currentCardIdx === selectedLesson.flashcards.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFlippedCardIdx(null);
                                setCurrentCardIdx(prev => Math.min(selectedLesson.flashcards.length - 1, prev + 1));
                              }}
                              className="p-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-full border border-slate-200 transition cursor-pointer"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          </div>

                        </div>
                      ) : (
                        <div className="text-center py-6 text-xs text-slate-400">لا توجد بطاقات مراجعة متاحة.</div>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* TAB CONTENT: Quiz */}
                {activeTab === 'quiz' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-h-[300px]">
                      
                      {!quizFinished ? (
                        /* Active Quiz Question */
                        <div className="space-y-6">
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black text-slate-500">
                              <span className="flex items-center gap-1">
                                <HelpCircle className="w-4 h-4 text-indigo-500" />
                                <span>صحيح حتى الآن: {score} أسئلة</span>
                              </span>
                              <span>سؤال {currentQuestionIdx + 1} من {selectedLesson.quiz.length}</span>
                            </div>
                            
                            {/* quiz progress tracker */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${((currentQuestionIdx + 1) / selectedLesson.quiz.length) * 100}%` }}
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-normal">
                              {selectedLesson.quiz[currentQuestionIdx].question}
                            </h4>
                          </div>

                          {/* Options Grid */}
                          <div className="space-y-3 pt-1">
                            {selectedLesson.quiz[currentQuestionIdx].options.map((opt, oIdx) => {
                              const isSelected = selectedOptionIdx === oIdx;
                              const isCorrect = selectedLesson.quiz[currentQuestionIdx].correctIndex === oIdx;
                              
                              let optionStyle = 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50';
                              if (isSelected && !quizSubmitted) {
                                optionStyle = 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-550/10 text-indigo-900';
                              } else if (quizSubmitted) {
                                if (isCorrect) {
                                  optionStyle = 'border-emerald-400 bg-emerald-500/10 text-emerald-900 font-extrabold';
                                } else if (isSelected && !isCorrect) {
                                  optionStyle = 'border-rose-300 bg-rose-500/10 text-rose-900';
                                } else {
                                  optionStyle = 'border-slate-50 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => handleOptionSelect(oIdx)}
                                  className={`w-full p-4 rounded-2xl text-right text-xs font-extrabold transition-all border outline-none flex items-center justify-between gap-4 ${
                                    quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                                  } ${optionStyle}`}
                                >
                                  <span>{opt}</span>
                                  <div className="shrink-0">
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    )}
                                    {quizSubmitted && isSelected && !isCorrect && (
                                      <X className="w-5 h-5 text-rose-600 border border-rose-100 bg-white rounded-full p-0.5" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* explanation box */}
                          <AnimatePresence>
                            {quizSubmitted && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-1.5 overflow-hidden text-right"
                              >
                                <h5 className="text-[10px] font-black text-indigo-750 flex items-center gap-1 leading-none uppercase">
                                  <Lightbulb className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                                  <span>توضيح رفيق المذاكرة لسر الإجابة:</span>
                                </h5>
                                <p className="text-xs text-slate-600 leading-relaxed font-bold pr-1 pt-1">
                                  {selectedLesson.quiz[currentQuestionIdx].explanation}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* submit & next controller */}
                          <div className="flex justify-end pt-2">
                            {!quizSubmitted ? (
                              <button
                                type="button"
                                disabled={selectedOptionIdx === null}
                                onClick={handleQuizSubmit}
                                className="px-6 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-755 hover:bg-indigo-700 text-white disabled:opacity-40 text-xs font-black rounded-xl transition-all hover:shadow-md cursor-pointer flex items-center gap-1.5"
                              >
                                <span>تأكيد الحل والتحقق 🧪</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleNextQuizQuestion}
                                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all hover:shadow-md cursor-pointer flex items-center gap-1.5"
                              >
                                <span>
                                  {currentQuestionIdx === selectedLesson.quiz.length - 1 
                                    ? 'إنهاء ورؤية التقييم 🏆' 
                                    : 'السؤال التالي 🌟'}
                                </span>
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                        </div>
                      ) : (
                        /* Quiz Finished Summary */
                        <div className="py-8 text-center space-y-6 max-w-md mx-auto" id="quiz-result-card">
                          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 relative">
                            <Award className="w-10 h-10 text-amber-600 animate-bounce" />
                            <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-ping opacity-25" />
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-amber-600 tracking-widest uppercase">تم الانتهاء من الاختبار المكتمل! 🎉🙌</span>
                            <h3 className="text-lg font-black text-slate-800">أنت أسطورة حقيقية في كسر الأسئلة!</h3>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed">
                              أنجزت اختبار الدرس: <span className="text-indigo-600">"{selectedLesson.title}"</span> المصنف تحت مادة <span className="font-extrabold text-indigo-700">{selectedLesson.subject}</span>.
                            </p>
                          </div>

                          {/* point scoreboard */}
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-around">
                            <div className="text-center">
                              <span className="block text-[10px] text-slate-400 font-bold">الدرجة النهائية</span>
                              <span className="block text-lg font-black text-indigo-600 font-sans mt-0.5">
                                {score} / {selectedLesson.quiz.length}
                              </span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-center">
                              <span className="block text-[10px] text-slate-400 font-bold">طاقة الرفيق اليومية 🔋</span>
                              <span className="block text-lg font-black text-amber-600 mt-0.5">
                                +15 نقطة
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-rose-600 font-extrabold animate-pulse leading-normal">
                            {score === selectedLesson.quiz.length 
                              ? 'علامة كاملة خرافية! رفيق المذاكرة فخور بيك جداً، لحظة فرحة والديك بالنتيجة بتقرب كل يوم! ⭐👑!' 
                              : score >= selectedLesson.quiz.length / 2 
                                ? 'رائع جداً! أخطأت في بعض النقاط الصعبة لتتعلمها الآن وتتجنبها بالأيام القادمة! 🦾✨' 
                                : 'مجهود عظيم! الغرض هو التعلم، عاود قراءة المادة المبسطة وجرب الامتحان لتنال النجم كامل التفوق! 📚🔥'}
                          </p>

                          <div className="flex gap-3 justify-center pt-2">
                            <button
                              type="button"
                              onClick={handleRestartQuiz}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
                            >
                              <RotateCcw className="w-4 h-4 text-slate-500" />
                              <span>إعادة حل الامتحان</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedLesson(null)}
                              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition cursor-pointer"
                            >
                              <span>الخروج ومراجعة الدروس</span>
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
