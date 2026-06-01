import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { BookOpen, Award, Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

export default function Onboarding({ onComplete, initialProfile }: OnboardingProps) {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile || {
    name: '',
    branch: '',
    dreamCollege: '',
    targetScore: 90,
    studyTime: '',
    isConfigured: false
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold text-lg">الكلية التي تحلم بها ⚔️:</label>
              <input
                type="text"
                placeholder="مثال: طب قصر العيني، هندسة القاهرة، ألسن..."
                value={profile.dreamCollege}
                onChange={(e) => setProfile({ ...profile, dreamCollege: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:outline-none transition bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-slate-700 font-semibold text-lg">المجموع المستهدف (%):</label>
                <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full">{profile.targetScore}%</span>
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
              <div className="flex justify-between text-xs text-slate-400">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
              </div>
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
