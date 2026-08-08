import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  Clock, 
  MapPin, 
  GraduationCap, 
  ChevronDown, 
  Camera, 
  Upload, 
  User, 
  Check, 
  Save, 
  Calendar,
  Layers,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EGYPTIAN_GOVERNORATES, POPULAR_COLLEGES_BY_BRANCH, getCollegesForBranchAndGov } from '../data/colleges';
import { registerOrUpdateUserInDB } from '../utils/userRegistry';

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

const AVATAR_PRESETS = [
  { id: 'pres-1', label: 'طالب متفوق', emoji: '👨‍🎓', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEF3C7"/><text y="70" x="22" font-size="55">👨‍🎓</text></svg>' },
  { id: 'pres-2', label: 'طالبة متفوقة', emoji: '👩‍🎓', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEE2E2"/><text y="70" x="22" font-size="55">👩‍🎓</text></svg>' },
  { id: 'pres-3', label: 'طبيبة المستقبل', emoji: '👩‍⚕️', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23E0F2FE"/><text y="70" x="22" font-size="55">👩‍⚕️</text></svg>' },
  { id: 'pres-4', label: 'مهندس المستقبل', emoji: '👨‍💻', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23ECFDF5"/><text y="70" x="22" font-size="55">👨‍💻</text></svg>' },
  { id: 'pres-5', label: 'مفكر ومبدع', emoji: '🧠', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23F3E8FF"/><text y="70" x="22" font-size="55">🧠</text></svg>' },
  { id: 'pres-6', label: 'البطل الذهبي', emoji: '👑', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEF3C7"/><text y="70" x="22" font-size="55">👑</text></svg>' },
];

interface ProfileTabProps {
  currentProfile: StudentProfile;
  onSave: (updatedProfile: StudentProfile) => void;
}

export default function ProfileTab({ currentProfile, onSave }: ProfileTabProps) {
  const [profile, setProfile] = useState<StudentProfile>(() => ({
    name: currentProfile.name || '',
    branch: currentProfile.branch || 'science',
    dreamCollege: currentProfile.dreamCollege || '',
    targetScore: currentProfile.targetScore || 90,
    studyTime: currentProfile.studyTime || 'morning',
    isConfigured: true,
    title: currentProfile.title || 'بطل الثانوية',
    examDate: currentProfile.examDate || '2026-06-15',
    avatarUrl: currentProfile.avatarUrl || AVATAR_PRESETS[0].url,
    notificationsEnabled: currentProfile.notificationsEnabled || false
  }));

  const [selectedGov, setSelectedGov] = useState('القاهرة');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت لتوفير مساحة متسعة للتخزين!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile(prev => ({
            ...prev,
            avatarUrl: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setError('الرجاء إدخال اسمك الكريم يا بطل!');
      return;
    }
    if (!profile.branch) {
      setError('الرجاء اختيار الشعبة الدراسية للثانوية العامة.');
      return;
    }
    if (!profile.dreamCollege.trim()) {
      setError('ما هي كلية أحلامك التي تسعى إليها؟ الرجاء إدخالها.');
      return;
    }
    if (profile.targetScore < 50 || profile.targetScore > 100) {
      setError('المجموع المستهدف يجب أن يكون بين 50% و 100%');
      return;
    }

    setError('');
    registerOrUpdateUserInDB(profile.name.trim(), profile.branch, profile.dreamCollege, 0, 0);
    onSave(profile);
    setSuccessMsg('تم حفظ وتحديث ملفك الشخصي وخطتك بنجاح يا بطل! ✨🎓');
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" dir="rtl">
      
      {/* Premium Hero Identity summary Card */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-850 relative overflow-hidden text-right">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-br-full pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-400 overflow-hidden bg-white/5 flex items-center justify-center">
              <img 
                src={profile.avatarUrl || AVATAR_PRESETS[0].url} 
                alt={profile.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-900 rounded-full p-1.5 border-2 border-slate-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-right flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full text-xs border border-amber-500/30">
                {profile.title || 'بطل الثانوية العامة'} 👑
              </span>
              <span className="bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-full text-xs border border-blue-500/30">
                {profile.branch === 'science' ? 'علمي علوم 🧬' : profile.branch === 'math' ? 'علمي رياضة 📐' : 'أدبي 📚'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              صاحب الهمة: <span className="text-amber-400 font-bold">{profile.name}</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              تسعى بكل عزم للوصول إلى <strong className="text-rose-400">{profile.dreamCollege}</strong> بمجموع <strong className="text-amber-400 font-mono text-base">{profile.targetScore}%</strong>.
            </p>

            {profile.examDate && (
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>تاريخ بداية ملحمتك: <strong className="text-white">{new Date(profile.examDate).toLocaleDateString('ar-EG', { dateStyle: 'long' })}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Forms Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <span>تعديل وحفظ بياناتك الشخصية والدراسية 📝</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">تتحكم التغييرات التي تجريها هنا في المواد المتاحة وفي ذكاء رفيقك النفسي والدراسي!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-2xl font-medium text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-2xl font-bold text-sm"
              >
                ✨ {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Name */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold text-base">اسم الشهرة (البطل):</label>
              <input
                type="text"
                placeholder="أدخل اسمك أو نيك نيم تفضله..."
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white text-base font-medium"
              />
            </div>

            {/* Title Preferrence */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold text-base">اللقب الكفاحي الكفؤ 👑:</label>
              <input
                type="text"
                placeholder="مثال: دكتور، مهندس، العبقري..."
                value={profile.title || ''}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white text-base font-medium"
              />
            </div>
          </div>

          {/* Picture management */}
          <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>الصورة الشخصية والرموز الرمزية 📸</span>
            </h4>

            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* Preview with file selector */}
              <div className="flex flex-col items-center gap-2.5 shrink-0">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden shadow-md bg-white flex items-center justify-center group cursor-pointer transition-transform hover:scale-105"
                  title="اضغط لتغيير صورتك"
                >
                  <img 
                    src={profile.avatarUrl} 
                    alt="صورتك" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3 h-3" />
                  <span>تحميل من جهازك 📤</span>
                </button>
              </div>

              {/* Presets selecting */}
              <div className="flex-1 space-y-2 w-full text-right">
                <span className="block text-xs font-bold text-slate-400">أو اختر رمزاً بطولياً مناسباً:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = profile.avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, avatarUrl: preset.url })}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer bg-white ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/10'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-[9px] text-slate-500 font-bold truncate max-w-full text-center">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Branch/Division choosing */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-bold text-base">الشعبة الدراسية للبطولة (تحدد المواد المتاحة):</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'science' })}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  profile.branch === 'science'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-full ${profile.branch === 'science' ? 'bg-amber-100 text-amber-600' : 'bg-slate-150 text-slate-500'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm">علمي علوم</span>
                <span className="text-[10px] text-slate-400">أحياء، جيولوجيا، فيزياء...</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'math' })}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  profile.branch === 'math'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-full ${profile.branch === 'math' ? 'bg-amber-100 text-amber-600' : 'bg-slate-150 text-slate-500'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm">علمي رياضة</span>
                <span className="text-[10px] text-slate-400">رياضيات بحتة وتطبيقية...</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'literature' })}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  profile.branch === 'literature'
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-full ${profile.branch === 'literature' ? 'bg-amber-100 text-amber-600' : 'bg-slate-150 text-slate-500'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-800 text-sm">أدبي</span>
                <span className="text-[10px] text-slate-400">تاريخ، جغرافيا، علم نفس وفلسفة...</span>
              </button>
            </div>
          </div>

          {/* Destination College & Target Metric */}
          <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-6">
            <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              <span>تعديل صنف وتفاصيل كلية أحلامك 🏆</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold text-sm">الكلية التي تحلم بها 🤺:</label>
                <input
                  type="text"
                  placeholder="مثال: طب المنصورة، ألسن عين شمس، هندسة..."
                  value={profile.dreamCollege}
                  onChange={(e) => setProfile({ ...profile, dreamCollege: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition bg-white text-base font-extrabold text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-700 font-bold text-sm">مجموعك المستهدف المستقبلي:</label>
                  <span className="text-amber-600 font-extrabold bg-amber-100/70 px-3 py-0.5 rounded-full text-sm border border-amber-250">{profile.targetScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={profile.targetScore}
                  onChange={(e) => setProfile({ ...profile, targetScore: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 py-3.5 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {/* Governorate College database finder */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <h5 className="text-xs font-extrabold text-slate-800 flex items-center justify-start gap-1.5">
                    <span>مستكشف الكليات وتنسيقها التقديري 🗺️</span>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">اضغط على أي كلية أدناه لتطبيقها تلقائياً بالحد المتوقع الخاص بالمحافظة!</p>
                </div>

                <div className="flex items-center justify-end gap-2 text-right">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>المحافظة الحالية:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGov}
                      onChange={(e) => setSelectedGov(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg py-1.5 pr-8 pl-3.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      {EGYPTIAN_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Popular keys */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">⭐ الاختيارات الشائعة لشعبتك المحددة:</span>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_COLLEGES_BY_BRANCH[profile.branch as 'science' | 'math' | 'literature']?.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => {
                          setProfile({
                            ...profile,
                            dreamCollege: col.name,
                            targetScore: col.score
                          });
                        }}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-150 text-amber-800 text-[11px] font-bold rounded-lg transition-transform hover:scale-[1.02] cursor-pointer flex items-center gap-1"
                      >
                        <span>{col.name}</span>
                        <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans">%{col.score}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gov results listings */}
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">🌍 الكليات المتاحة في محافظة ({selectedGov}):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {getCollegesForBranchAndGov(profile.branch as 'science' | 'math' | 'literature', selectedGov).map((item) => {
                      const isSelected = profile.dreamCollege === `${item.name} - ${item.university}` || profile.dreamCollege === item.name;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setProfile({
                              ...profile,
                              dreamCollege: `${item.name} - ${item.university}`,
                              targetScore: item.estScore
                            });
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer text-right flex flex-col justify-between gap-1 hover:border-amber-300 bg-white ${
                            isSelected 
                              ? 'bg-gradient-to-l from-orange-50/50 to-amber-50/50 border-amber-400 shadow-sm'
                              : 'border-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[11px] font-extrabold text-slate-800 truncate">{item.name}</span>
                            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md font-sans">%{item.estScore}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold block">{item.university}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred study times */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold text-sm">وقت الاستذكار المفضل للتركيز ⏱️:</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, studyTime: 'morning' })}
                  className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold flex items-center justify-between ${
                    profile.studyTime === 'morning'
                      ? 'border-amber-500 bg-amber-50/50 text-amber-800'
                      : 'border-slate-100 hover:border-slate-200 text-slate-650'
                  }`}
                >
                  <span>صباحي ☀️</span>
                  {profile.studyTime === 'morning' && <Check className="w-4 h-4 text-amber-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, studyTime: 'evening' })}
                  className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer text-xs font-bold flex items-center justify-between ${
                    profile.studyTime === 'evening'
                      ? 'border-amber-500 bg-amber-50/50 text-amber-800'
                      : 'border-slate-100 hover:border-slate-200 text-slate-650'
                  }`}
                >
                  <span>مسائي 🌙</span>
                  {profile.studyTime === 'evening' && <Check className="w-4 h-4 text-amber-500" />}
                </button>
              </div>
            </div>

            {/* Exam Date Countdown configure */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-bold text-sm">تعديل تاريخ بداية الامتحانات 📅:</label>
              <input
                type="date"
                value={profile.examDate || ''}
                onChange={(e) => setProfile({ ...profile, examDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border-2 border-slate-100 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white text-xs font-bold text-slate-800 text-right"
              />
            </div>
          </div>

          {/* Browser Push Notifications reminder */}
          <div className="bg-gradient-to-l from-indigo-50/50 to-slate-50 border border-slate-150 p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-right space-y-1">
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-start gap-1.5">
                  <span>تفعيل تنبيهات دفع خفيفة (إشعارات المتصفح) 🔔</span>
                  <span className="bg-indigo-100 text-indigo-700 text-[9px] px-2 py-0.5 rounded-full font-black">جديد</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  احصل على تذكير خفيف من رفيقك في المتصفح تلقائياً عند انتهاء مؤقت الراحة أو وقت المذاكرة وبدء جلسة البومودورو القادمة.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const nextVal = !profile.notificationsEnabled;
                  if (nextVal) {
                    if (!('Notification' in window)) {
                      setError('عذراً يا بطل! متصفحك الحالي لا يدعم ميزة إشعارات المتصفح.');
                      return;
                    }
                    try {
                      const permission = await Notification.requestPermission();
                      if (permission !== 'granted') {
                        setError('تم رفض صلاحية الإشعارات من قبل المتصفح. يرجى تفعيل الصلاحية يدوياً من إعدادات القفل في شريط عنوان المتصفح لتعمل الميزة!');
                        return;
                      }
                      // Test notification
                      new Notification('تم التفعيل بنجاح! 🎉', {
                        body: 'سأقوم بمتابعة تذكيرك بمواعيد جلساتك يا بطل!',
                        icon: profile.avatarUrl || undefined
                      });
                    } catch (e) {
                      console.error('Notification error:', e);
                    }
                  }
                  setProfile({ ...profile, notificationsEnabled: nextVal });
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 focus:outline-none cursor-pointer shrink-0 relative ${
                  profile.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-250 absolute top-1 ${
                    profile.notificationsEnabled ? 'left-1' : 'right-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Developer Contact Card */}
          <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 border border-amber-200/70 p-5 rounded-3xl space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>💬 تواصل مع مطور التطبيق (محمد محمود)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  لديك استفسار، تعليق، أو اقتراح ميزة جديدة للتطبيق؟ يسعدني تواصلك المباشر عبر واتساب أو تيليجرام:
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                <a 
                  href="https://wa.me/201031498281" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>واتساب: 01031498281</span>
                </a>
                <a 
                  href="https://t.me/+201031498281" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition transform hover:scale-[1.02]"
                >
                  <TelegramIcon className="w-4 h-4 fill-current" />
                  <span>تيليجرام: 01031498281</span>
                </a>
              </div>
            </div>
          </div>

          {/* Save Action Form Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-650 text-white rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>حفظ جميع معلومات وتفاصيل ملفي 💾</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
