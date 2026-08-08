import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, Heart, GraduationCap, ChevronLeft, ArrowLeft, Phone, RefreshCw } from 'lucide-react';
import { MOTIVATIONAL_SLOGANS } from '../data';

interface AuthScreenProps {
  onLogin: (username: string) => void;
}

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 2.56 1.488 4.582 1.489 5.485 0 9.95-4.461 10.003-9.944.026-2.653-.979-5.143-2.842-7.009C16.486 1.83 14.004 1.01 11.45 1.01c-5.495 0-9.96 4.466-9.963 9.952-.001 2.05.535 4.053 1.551 5.8l-.29 1.058-.646 2.361 2.42-.635.807-.212-.279.168zm11.393-8.243c-.354-.176-2.09-.323-2.484-.467-.31-.115-.536-.174-.761.163-.225.337-.872 1.101-1.07 1.325-.196.223-.393.249-.747.072-1.347-.674-2.22-1.22-3.1-2.727-.234-.4-.234-.69.043-.966.215-.213.479-.558.718-.838.239-.28.32-.48.479-.8.16-.32.08-.6-.041-.84-.12-.24-.761-2.046-1.07-2.793-.3-.722-.607-.624-.833-.635-.215-.01-.462-.012-.71-.012-.247 0-.651.093-.992.467-.34.375-1.302 1.272-1.302 3.102 0 1.829 1.329 3.593 1.514 3.84.184.248 2.61 4.002 6.324 5.602.883.38 1.573.607 2.112.778.887.282 1.695.242 2.333.147.712-.107 2.19-.894 2.499-1.758.309-.863.309-1.605.216-1.759-.093-.154-.34-.247-.693-.423z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.568 8.161c-.181 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.321.016.108.033.318.018.498z"/>
  </svg>
);

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState(1);
  const [studentNameInput, setStudentNameInput] = useState('');
  const [currentSlogan, setCurrentSlogan] = useState(() => {
    const index = Math.floor(Math.random() * MOTIVATIONAL_SLOGANS.length);
    return MOTIVATIONAL_SLOGANS[index];
  });

  const handleNextSlogan = () => {
    const filtered = MOTIVATIONAL_SLOGANS.filter(s => s !== currentSlogan);
    const index = Math.floor(Math.random() * filtered.length);
    setCurrentSlogan(filtered[index] || MOTIVATIONAL_SLOGANS[0]);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    const finalName = studentNameInput.trim() || 'بطل_الثانوية';
    onLogin(finalName);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-350" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* App Logo Emblem */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/10 mb-6"
        >
          <GraduationCap className="w-11 h-11" />
        </motion.div>
        
        <h2 className="text-3xl text-center font-extrabold text-slate-800 font-display">
          رفيق الثانوية العامة 🎓
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 max-w-sm mx-auto">
          توجيه نفسي، تنظيم وقت، وجلسات تركيز ذكية بلا تشتيت إلكتروني
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-6 sm:px-12 shadow-lg rounded-3xl border border-slate-100 relative overflow-hidden flex flex-col min-h-[420px] justify-between">
          
          {/* Top colored highlight line */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-l from-amber-500 via-orange-500 to-amber-600" />

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((num) => (
              <div 
                key={num} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === num ? 'w-8 bg-amber-500' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Steps Presentation with Transitions */}
          <div className="flex-1 flex flex-col justify-center py-4 text-center">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-2">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight">
                    مرحباً بكم في تطبيقي 🌟
                  </h3>
                  <p className="text-lg font-bold text-amber-600 font-display bg-amber-50/50 py-3.5 px-6 rounded-2xl border border-amber-100 max-w-md mx-auto">
                    (رفيق الثانوية العامة) 🎓
                  </p>

                  {/* Motivational Slogan Banner */}
                  <div className="bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 border-2 border-dashed border-amber-300 p-5 rounded-3xl max-w-md mx-auto space-y-3.5 shadow-sm text-right relative group">
                    <div className="flex items-center justify-between">
                      <h4 className="text-amber-700 font-extrabold text-base leading-tight flex items-center gap-1.5 select-none">
                        💡 جرعتك التحفيزية
                      </h4>
                      <button
                        type="button"
                        onClick={handleNextSlogan}
                        className="p-1.5 px-2.5 rounded-lg bg-white hover:bg-amber-100 text-amber-600 border border-amber-200/60 transition text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                        title="تبديل العبارة التحفيزية"
                      >
                        <RefreshCw className="w-3 h-3" />
                        عبارة أخرى ✨
                      </button>
                    </div>
                    <p className="text-slate-800 font-black text-sm sm:text-base leading-relaxed">
                      {currentSlogan}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                     نسختك المجانية والمحلية 100% للتركيز وتذوق طعم التفوق الحقيقي خطوة بخطوة.
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-2">
                    <Heart className="w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-relaxed px-2">
                    قصة التطبيق وهدفه 📖
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl max-w-md mx-auto leading-relaxed text-right md:text-center text-slate-700 font-bold text-sm sm:text-base shadow-inner">
                    "التطبيق دا انا صممته علي أنظم وقت أخواتي طلاب الثانويه العامة ربنا يعين كل واحد فيهم" 🤝❤️
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-tr from-emerald-50 to-sky-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <WhatsAppIcon className="w-7 h-7 text-emerald-500" />
                      <TelegramIcon className="w-7 h-7 text-sky-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-relaxed px-4">
                    مستعد لسماع آرائكم واستفساراتكم دائماً 💬✨
                  </h3>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm max-w-md mx-auto bg-slate-50 border border-slate-100/60 p-4 rounded-2xl">
                    لو في حد عنده أي تعليق أو تعديل علي الابلكيشن يبعتلي واتس أو تيليجرام علي الرقم دا وأنا ان شاء الله هرد عليه 
                  </div>
                  
                  {/* WhatsApp & Telegram Interactive Clicks */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a 
                      href="https://wa.me/201031498281" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 px-5 rounded-2xl shadow-md transition duration-200 text-xs sm:text-sm font-extrabold font-mono cursor-pointer hover:shadow-lg transform hover:scale-[1.02] w-full sm:w-auto justify-center"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      <span>واتساب: 01031498281</span>
                    </a>
                    <a 
                      href="https://t.me/+201031498281" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white p-3.5 px-5 rounded-2xl shadow-md transition duration-200 text-xs sm:text-sm font-extrabold font-mono cursor-pointer hover:shadow-lg transform hover:scale-[1.02] w-full sm:w-auto justify-center"
                    >
                      <TelegramIcon className="w-5 h-5" />
                      <span>تيليجرام: 01031498281</span>
                    </a>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-2">
                    <Sparkles className="w-10 h-10 animate-pulse text-amber-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-relaxed px-2">
                    تسجيل بيانات البطل الجدد 📝🎓
                  </h3>

                  {/* Real Student Name Input Field */}
                  <div className="max-w-md mx-auto text-right space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                    <label htmlFor="student-login-name-input" className="block text-xs font-black text-slate-700">
                      ادخل اسمك الكريم للتسجيل بحسابك على الموقع:
                    </label>
                    <input
                      id="student-login-name-input"
                      type="text"
                      value={studentNameInput}
                      onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="مثال: أحمد محمد علي"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-[11px] text-slate-400 font-bold">
                      * سَيتم التسجيل باسمك الحقيقي في قائمة المتصدرين وقاعدة بيانات الطلاب المسجلين بالمنصة.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-amber-50/70 via-orange-50/40 to-amber-50/70 border-2 border-dashed border-amber-300 p-4 rounded-2xl max-w-md mx-auto leading-relaxed text-right md:text-center text-slate-800 font-black text-xs sm:text-sm shadow-sm">
                     "حتى لو ملحقتش الكلية اللي كان نفسك فيها.. أكيد ربنا هيعوضك بكلية أحسن منها! ربنا دايماً كاتبلك الخير والتفوق الحقيقي في المكان الأنسب ليك 🤲❤️"
                  </div>

                  {/* Active Local Storage Notice Checkbox */}
                  <div className="flex items-center justify-center gap-2 pt-2 text-slate-500 text-xs font-bold leading-relaxed border-t border-slate-100/85 max-w-md mx-auto">
                    <input 
                      type="checkbox" 
                      id="remember-login-check-final" 
                      checked={true}
                      readOnly
                      className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400 accent-emerald-500 cursor-not-allowed" 
                    />
                    <label htmlFor="remember-login-check-final" className="cursor-pointer text-slate-700 select-none">
                      تذكر بياناتي وحفظ الحساب تلقائياً 💾🔐
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation/Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            {/* Back button */}
            {step > 1 ? (
              <button
                onClick={handleBack}
                type="button"
                className="p-3 px-5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4 turn-on-rtl rotate-180" />
                السابق
              </button>
            ) : (
              <div className="w-20" /> // Empty space placeholder to preserve layout alignment
            )}

            {/* Next or Submit / Login Button */}
            {step < 4 ? (
              <button
                onClick={handleNext}
                type="button"
                className="p-3 px-7 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold text-xs cursor-pointer flex items-center gap-1.5 shadow transition-all transform hover:scale-[1.02]"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                type="button"
                className="p-3 px-8 bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-extrabold text-xs cursor-pointer flex items-center gap-2 shadow-lg transition-all transform hover:scale-[1.02] animate-bounce"
              >
                <span>تسجيل الدخول 🚀</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
