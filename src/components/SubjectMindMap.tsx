import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, BookOpen, CheckCircle2, Circle, X, Target, Plus } from 'lucide-react';
import { Task } from '../types';
import { SUBJECTS_BY_BRANCH } from '../data';

interface SubjectMindMapProps {
  branch: 'science' | 'math' | 'literature' | '';
  tasks: Task[];
}

export default function SubjectMindMap({ branch, tasks }: SubjectMindMapProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const subjects = SUBJECTS_BY_BRANCH[branch || ''] || SUBJECTS_BY_BRANCH[''];

  const getTasksForSubject = (subjectName: string) => {
    return tasks.filter(t => t.subject === subjectName);
  };

  const getCompletionStats = (subjectName: string) => {
    const subjectTasks = getTasksForSubject(subjectName);
    const completed = subjectTasks.filter(t => t.isCompleted).length;
    return {
      total: subjectTasks.length,
      completed,
      percent: subjectTasks.length > 0 ? (completed / subjectTasks.length) * 100 : 0
    };
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8" dir="rtl" id="subject-mind-map">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="text-right">
          <h3 className="text-lg font-extrabold text-slate-800 font-display flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-indigo-500" />
            <span>خريطة المواد الذهنية التفاعلية 🧠🗺️</span>
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1">
            نظرة شمولية على توزيع مجهودك وأهدافك لكل مادة دراسية
          </p>
        </div>
        {!selectedSubject && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shrink-0">
             <Target className="w-3.5 h-3.5 text-amber-500" />
             <span className="text-[10px] font-black text-slate-500">اضغط على المادة لمتابعة مهامها</span>
          </div>
        )}
      </div>

      <div className="relative min-h-[400px] flex items-center justify-center overflow-visible">
        {/* Center Node */}
        <div className="relative z-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/30 flex items-center justify-center text-white border-4 border-white z-20"
          >
            <div className="text-center px-1">
              <span className="block text-[8px] sm:text-[10px] font-black opacity-80 uppercase tracking-widest">البطل</span>
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mx-auto my-1" />
              <span className="block text-[9px] sm:text-[11px] font-black leading-tight">رحلة القمة 🎓</span>
            </div>
          </motion.div>

          {/* Subject Nodes Positioned in a Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
             {subjects.map((sub, idx) => {
               const angle = (idx / subjects.length) * (2 * Math.PI);
               const radius = window.innerWidth < 640 ? 120 : 150; // Dynamic radius for responsiveness
               const x = Math.cos(angle) * radius;
               const y = Math.sin(angle) * radius;
               
               const stats = getCompletionStats(sub);
               const isSelected = selectedSubject === sub;

               return (
                 <React.Fragment key={sub}>
                   {/* Visual Connection Line */}
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="absolute h-0.5 bg-indigo-200 origin-right -z-10"
                    style={{ 
                        width: radius, 
                        transform: `rotate(${angle * (180 / Math.PI)}deg) translateX(${-radius}px)`,
                        right: '50%'
                    }}
                   />
                   
                   <motion.button
                     initial={{ opacity: 0, scale: 0 }}
                     animate={{ opacity: 1, scale: 1, x, y }}
                     whileHover={{ scale: 1.1, zIndex: 30 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setSelectedSubject(isSelected ? null : sub)}
                     className={`absolute w-16 h-16 sm:w-24 sm:h-24 -ml-8 -mt-8 sm:-ml-12 sm:-mt-12 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 sm:p-3 text-center shadow-sm cursor-pointer group ${
                       isSelected 
                         ? 'bg-indigo-600 border-indigo-400 text-white z-40 ring-4 ring-indigo-100' 
                         : stats.total > 0 && stats.completed === stats.total
                           ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                           : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 hover:shadow-md'
                     }`}
                   >
                     <span className={`text-[8px] sm:text-[10px] font-black line-clamp-2 leading-tight uppercase ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {sub}
                     </span>
                     
                     {stats.total > 0 && (
                        <>
                            <div className="mt-1.5 sm:mt-2 w-full bg-slate-200/50 h-1 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.percent}%` }}
                                    className={`h-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} 
                                />
                            </div>
                            <span className={`text-[7px] sm:text-[8px] font-bold mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {stats.completed}/{stats.total} مهام
                            </span>
                        </>
                     )}

                     {!isSelected && stats.total === 0 && (
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-3 h-3 text-slate-300" />
                        </div>
                     )}
                   </motion.button>
                 </React.Fragment>
               );
             })}
          </div>
        </div>
      </div>

      {/* Interactive Detail Panel when subject is selected */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-10 bg-slate-50 rounded-[2rem] p-6 border border-slate-200 relative shadow-inner"
          >
            <button 
              onClick={() => setSelectedSubject(null)}
              className="absolute left-4 top-4 p-2 hover:bg-slate-200 rounded-xl transition text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <span>متابعة مادة: {selectedSubject} 📖</span>
                </h4>
                <p className="text-[10px] font-bold text-slate-400 pr-7">قائمة المهام المرتبطة بهذه المادة فقط</p>
              </div>

              <div className="flex items-center gap-3">
                 <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-slate-400">الإنجاز</span>
                    <span className="text-sm font-black text-emerald-600">{getCompletionStats(selectedSubject).percent.toFixed(0)}%</span>
                 </div>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {getTasksForSubject(selectedSubject).length > 0 ? (
                getTasksForSubject(selectedSubject).map(task => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={task.id} 
                    className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-1.5 rounded-lg border ${task.isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        {task.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-black leading-tight ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                            {task.title}
                        </span>
                        {task.pomodoroCount > 0 && (
                            <span className="text-[9px] font-bold text-amber-500 mt-1 flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                {task.pomodoroCount} جلسات مركزة
                            </span>
                        )}
                      </div>
                    </div>
                    {task.isCompleted && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">منجز ✅</span>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/40 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Target className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">مفيش أي مهام متسجلة للمادة دي حالياً.</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">روح لتبويب المهام واختار مادة "{selectedSubject}" وأضف أول مهمة ليك!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
