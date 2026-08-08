import React, { useState, useRef } from 'react';
import { StudentProfile } from '../types';
import { BookOpen, Award, Sparkles, Clock, MapPin, GraduationCap, ChevronDown, Camera, Upload, User } from 'lucide-react';
import { motion } from 'motion/react';
import { EGYPTIAN_GOVERNORATES, POPULAR_COLLEGES_BY_BRANCH, getCollegesForBranchAndGov } from '../data/colleges';
import { registerOrUpdateUserInDB } from '../utils/userRegistry';

const AVATAR_PRESETS = [
  { id: 'pres-1', label: 'طالب متفوق', emoji: '👨‍🎓', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEF3C7"/><text y="70" x="22" font-size="55">👨‍🎓</text></svg>' },
  { id: 'pres-2', label: 'طالبة متفوقة', emoji: '👩‍🎓', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEE2E2"/><text y="70" x="22" font-size="55">👩‍🎓</text></svg>' },
  { id: 'pres-3', label: 'طبيبة المستقبل', emoji: '👩‍⚕️', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23E0F2FE"/><text y="70" x="22" font-size="55">👩‍⚕️</text></svg>' },
  { id: 'pres-4', label: 'مهندس المستقبل', emoji: '👨‍💻', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23ECFDF5"/><text y="70" x="22" font-size="55">👨‍💻</text></svg>' },
  { id: 'pres-5', label: 'مفكر ومبدع', emoji: '🧠', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23F3E8FF"/><text y="70" x="22" font-size="55">🧠</text></svg>' },
  { id: 'pres-6', label: 'البطل الذهبي', emoji: '👑', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="50" fill="%23FEF3C7"/><text y="70" x="22" font-size="55">👑</text></svg>' },
];

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

export default function Onboarding({ onComplete, initialProfile }: OnboardingProps) {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const base = initialProfile || {
      name: '',
      branch: '',
      dreamCollege: '',
      targetScore: 90,
      studyTime: '',
      isConfigured: false,
    };
    return {
      name: base.name,
      branch: base.branch,
      dreamCollege: base.dreamCollege,
      targetScore: base.targetScore,
      studyTime: base.studyTime,
      isConfigured: base.isConfigured,
      title: base.title || 'بطل الثانوية',
      examDate: base.examDate || '2026-06-15',
      avatarUrl: base.avatarUrl || AVATAR_PRESETS[0].url
    };
  });

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

  const [selectedGov, setSelectedGov] = useState('القاهرة');
  const [error, setError] = useState('');

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
    if (!profile.studyTime) {
      setError('الرجاء تحديد وقتك المفضل للمذاكرة.');
      return;
    }

    setError('');
    registerOrUpdateUserInDB(profile.name.trim(), profile.branch, profile.dreamCollege, 0, 0);

    onComplete({
      ...profile,
      isConfigured: true
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 text-right" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-l from-amber-500 to-orange-600 p-8 text-white relative">
          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-2">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold font-display">أهلاً بك في رفيق الثانوية 🎓</h2>
          <p className="mt-2 text-orange-50 font-light leading-relaxed">
            دعنا نجهز ملفك الشخصي لنبني خطتك وأهدافك. رفيقك الذكي متواجد هنا لمساندتك نفسياً ودراسياً طوال العام الصعب!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-2xl font-medium text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Student Name */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold text-lg">اسم الشهرة (البطل):</label>
            <input
              type="text"
              placeholder="مثال: يوسف، سارة، أحمد..."
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition text-lg bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Student Profile Picture Selection */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
              <Camera className="w-5 h-5 text-amber-500" />
              <span>صورتك الشخصية (لتخصيص حساب الأبطال) 📸</span>
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Preview Circle */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden shadow-md bg-white flex items-center justify-center group cursor-pointer transition-transform hover:scale-105"
                  title="ضغط لتغيير صورتك"
                >
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt="صورتك" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-slate-300">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
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
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تحميل صورتك الخاصة 📤</span>
                </button>
              </div>

              {/* Presets Grid */}
              <div className="flex-1 space-y-2.5 w-full">
                <label className="block text-slate-500 font-bold text-xs text-right">أو اختر من الرموز الجاهزة لرحلتك 🚀:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = profile.avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, avatarUrl: preset.url })}
                        className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer bg-white ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/10'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{preset.emoji}</span>
                        <span className="text-[9px] text-slate-500 font-bold truncate max-w-full text-center">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Highschool Division Selection */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold text-lg">شعبتك في الثانوية العامة:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'science' })}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  profile.branch === 'science'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-full ${profile.branch === 'science' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800">علمي علوم</span>
                <span className="text-xs text-slate-400">أحياء، جيولوجيا، فيزياء...</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'math' })}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  profile.branch === 'math'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-full ${profile.branch === 'math' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                  <Award className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800">علمي رياضة</span>
                <span className="text-xs text-slate-400">جبر، كالكولاس، تطبيقية...</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, branch: 'literature' })}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  profile.branch === 'literature'
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-full ${profile.branch === 'literature' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800">أدبي</span>
                <span className="text-xs text-slate-400">تاريخ، جغرافيا، فلسفة...</span>
              </button>
            </div>
          </div>

          {/* Dream College and Score */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
              <GraduationCap className="w-6 h-6 text-amber-500" />
              <span>الهدف الأكاديمي والكلية المنشودة 🎯</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold text-base">الكلية التي تحلم بها ⚔️:</label>
                <input
                  type="text"
                  placeholder="مثال: طب قصر العيني، هندسة المنصورة، ألسن..."
                  value={profile.dreamCollege}
                  onChange={(e) => setProfile({ ...profile, dreamCollege: e.target.value })}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition bg-white focus:bg-white text-base font-bold text-slate-800 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-700 font-semibold text-base">المجموع المستهدف (%):</label>
                  <span className="text-amber-600 font-bold bg-amber-100/70 px-3.5 py-1 rounded-full text-base border border-amber-200">{profile.targetScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={profile.targetScore}
                  onChange={(e) => setProfile({ ...profile, targetScore: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 py-3 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {/* Smart College Explorer Wrapper */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="text-right">
                  <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-start gap-1.5">
                    <span>مستكشف كليات مصر وعناوين المحافظات 🇪🇬</span>
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold">اختر كليتك لتحديد هدف المجموع والمحافظة التلقائية</p>
                </div>
                
                {profile.branch && (
                  <div className="flex items-center justify-end gap-2 text-right">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>اختر محافظتك:</span>
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
                )}
              </div>

              {!profile.branch ? (
                <div className="text-center py-6">
                  <span className="text-sm text-slate-400 font-bold">الرجاء اختيار شعبتك الدراسية في الأعلى أولاً لفتح مستكشف الكليات والحد الأدنى لكل محافظة! 👆✨</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Popular choices */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-2 text-right">⭐ الاختيار السريع لأشهر كليات شعبتك (اضغط للتحديد الفوري):</span>
                    <div className="flex flex-wrap gap-2 justify-start">
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
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{col.name}</span>
                          <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans">%{col.score}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Governorate results */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 block mb-2 text-right">🌍 الكليات المتاحة لشعبتك في محافظة ({selectedGov}):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
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
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-right flex flex-col justify-between gap-1.5 hover:shadow-sm ${
                              isSelected 
                                ? 'bg-gradient-to-l from-orange-50/70 to-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-400/25'
                                : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="text-right">
                                <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                                  <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>{item.name}</span>
                                </h5>
                                <span className="text-[11px] text-slate-500 font-bold block mt-0.5">{item.university}</span>
                              </div>
                              <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0 font-sans">%{item.estScore}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal font-medium">{item.note}</p>
                            <div className="text-left">
                              <span className="text-[10px] text-amber-600 font-extrabold hover:underline">اضغط للاختيار ككلية أحلامك 🚀</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preferred Study Time */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold text-lg">ساعات دراستك المفضلة (متى تركز أكثر؟):</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, studyTime: 'morning' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  profile.studyTime === 'morning'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="font-semibold text-slate-800">الفترة الصباحية (طائر مبكر)</span>
                <Clock className="w-5 h-5 text-amber-500 animate-spin-slow" />
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, studyTime: 'evening' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  profile.studyTime === 'evening'
                    ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="font-semibold text-slate-800">الفترة المسائية (بومة الليل)</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </button>
            </div>
          </div>

          {/* Custom user title selection */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-semibold text-lg">اختر لقبك المفضل (لتناديك به المنصة) 👑:</label>
            <div className="flex flex-wrap gap-2">
              {[
                'بطل الثانوية',
                'دكتور',
                'مهندس',
                'العبقري',
                'العالم',
                'المستشار',
                'الأستاذ'
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setProfile({ ...profile, title: preset })}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                    profile.title === preset
                      ? 'bg-amber-100 text-amber-800 border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="أو اكتب لقباً خاصاً بك هنا (مثال: البروفيسور، وحش المذاكرة)..."
              value={profile.title || ''}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white text-base"
            />
          </div>

          {/* Exam Date Input */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold text-lg">تاريخ بداية الامتحانات (لحساب العد التنازلي) 📅:</label>
            <input
              type="date"
              value={profile.examDate || ''}
              onChange={(e) => setProfile({ ...profile, examDate: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white text-right"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-xl font-bold font-display shadow-lg hover:shadow-xl transition-all shine-effect cursor-pointer"
            >
              انطلق كبطل الثانوية! 🚀
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
