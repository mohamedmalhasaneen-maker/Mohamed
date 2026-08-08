import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Users, 
  Sparkles, 
  Award,
  Zap, 
  UsersRound,
  ShieldCheck,
  ChevronLeft,
  Crown,
  HeartHandshake,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRegisteredUsersFromDB, registerOrUpdateUserInDB, RegisteredUser } from '../utils/userRegistry';

interface GroupChallengesProps {
  userWeeklyPomodoros: number;
  userName: string;
  userBranch: string;
  onAddPoints: (points: number) => void;
  onAddActivityLog: (type: any, desc: string) => void;
}

interface TeamMember {
  name: string;
  branch: string;
  pomodoros: number;
  avatar: string;
  dreamCollege?: string;
  isUser?: boolean;
}

export default function GroupChallenges({ 
  userWeeklyPomodoros, 
  userName, 
  userBranch, 
  onAddPoints,
  onAddActivityLog
}: GroupChallengesProps) {
  // Combined and sorted leaderboard
  const [leaderboard, setLeaderboard] = useState<TeamMember[]>([]);
  const [totalRegisteredCount, setTotalRegisteredCount] = useState<number>(0);

  // Load registered users from database & sync active user profile
  useEffect(() => {
    const currentUserNameDisplay = (userName && userName.trim() !== '' && userName !== 'بطل' ? userName.trim() : 'طالب ثانوية بطل');

    const userBranchArabic = userBranch === 'science' 
      ? 'علمي علوم' 
      : userBranch === 'math' 
      ? 'علمي رياضة' 
      : userBranch === 'literature' 
      ? 'أدبي' 
      : 'عام';

    // Register/update current user in DB if valid name exists
    if (currentUserNameDisplay && currentUserNameDisplay !== 'طالب ثانوية بطل') {
      registerOrUpdateUserInDB(currentUserNameDisplay, userBranch, '', userWeeklyPomodoros, userWeeklyPomodoros * 15);
    }

    const dbUsers = getRegisteredUsersFromDB();
    setTotalRegisteredCount(dbUsers.length);

    // Build leaderboard items from registered users
    const mappedLeaderboard: TeamMember[] = dbUsers.map(u => {
      const isCurrentUser = u.name === currentUserNameDisplay || u.name === `${currentUserNameDisplay} (أنت)`;
      return {
        name: isCurrentUser ? `${currentUserNameDisplay} (أنت)` : u.name,
        branch: u.branch,
        dreamCollege: u.dreamCollege,
        pomodoros: isCurrentUser ? Math.max(u.pomodoros, userWeeklyPomodoros) : u.pomodoros,
        avatar: isCurrentUser ? '⚡' : u.avatar,
        isUser: isCurrentUser
      };
    });

    // If current user wasn't in DB yet, append them
    if (!mappedLeaderboard.some(m => m.isUser)) {
      mappedLeaderboard.push({
        name: `${currentUserNameDisplay} (أنت)`,
        branch: userBranchArabic,
        pomodoros: userWeeklyPomodoros,
        avatar: '⚡',
        isUser: true
      });
      setTotalRegisteredCount(prev => prev + 1);
    }

    // Sort by highest pomodoros
    mappedLeaderboard.sort((a, b) => b.pomodoros - a.pomodoros);

    setLeaderboard(mappedLeaderboard);
  }, [userWeeklyPomodoros, userName, userBranch]);

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Banner introduction with beautiful gradients */}
      <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-indigo-850 shadow-xl relative overflow-hidden text-right select-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-505/10 rounded-full filter blur-[120px] -mt-24 -ml-24 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[120px] -mb-20 -mr-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full font-black tracking-widest uppercase">
              لوحة المتصدرين الحقيقية 🤝🚀
            </span>
            <h2 className="text-xl md:text-2xl font-black font-display leading-tight">
              طلاب الثانوية العامة المسجلون على الموقع 🎓✨
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-bold max-w-xl leading-relaxed">
              تتنافس هنا أسماء الطلاب الحقيقيين المسجلين على التطبيق. زِد من عدد جلساتك وسجل إنجازاتك لترتفع إلى قمة الأبطال!
            </p>
          </div>
          
          {/* Registered Users Count Highlight Card */}
          <div className="p-5 bg-gradient-to-br from-indigo-800/80 to-indigo-950/80 rounded-3xl border border-indigo-700/50 shadow-lg flex items-center gap-4 text-right shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Users className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs font-bold text-indigo-200">إجمالي الأشخاص والطلاب المسجلين:</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl md:text-3xl font-black font-mono text-amber-400">{totalRegisteredCount}</span>
                <span className="text-xs font-extrabold text-slate-200">طالب مسجل 🎓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table for Real Registered Users */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
          <div className="text-right">
            <h3 className="text-lg font-extrabold text-slate-800 font-display flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500 animate-pulse" />
              <span>ترتيب الطلاب المسجلين حقيقياً على المنصة 🏆</span>
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-1">المراكز مبنية على عدد الحسابات الحقيقية المسجلة بالمنصة</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs bg-emerald-50 text-emerald-700 font-black px-3.5 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{totalRegisteredCount} حساب مسجل بالمنصة</span>
            </span>
          </div>
        </div>

        {/* Leaderboard table body */}
        <div className="space-y-3.5">
          {leaderboard.map((member, index) => {
            const rankLabels = ['الأول 👑', 'الثاني 🥈', 'الثالث 🥉', 'الرابع 🎖️', 'الخامس 🎖️', 'السادس 🎖️', 'السابع 🎖️', 'الثامن 🎖️', 'التاسع 🎖️', 'العاشر 🎖️'];
            const isUser = !!member.isUser;
            return (
              <div 
                key={index}
                className={`p-4 md:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isUser 
                    ? 'bg-amber-500/10 border-amber-300 shadow-md ring-2 ring-amber-500/5' 
                    : 'bg-slate-50 border-slate-100/80 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Rank Index Badge */}
                  <div className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs md:text-sm ${
                    index === 0 
                      ? 'bg-amber-500 text-slate-950 font-black text-sm shadow-md' 
                      : index === 1
                      ? 'bg-slate-300 text-slate-700 font-black'
                      : index === 2
                      ? 'bg-orange-200 text-orange-700 font-black'
                      : 'bg-slate-200 text-slate-600 font-bold'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <span className="text-2xl md:text-3xl">{member.avatar}</span>

                  {/* Name, Branch & Dream College */}
                  <div className="text-right">
                    <h4 className={`text-sm md:text-base font-black flex items-center gap-2 ${isUser ? 'text-amber-800' : 'text-slate-800'}`}>
                      <span>{member.name}</span>
                      {isUser && <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">حسابك الحالي</span>}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 font-bold">شعبة: {member.branch}</span>
                      {member.dreamCollege && (
                        <>
                          <span className="text-slate-300 text-[10px]">•</span>
                          <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>{member.dreamCollege}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="text-right">
                    <span className={`text-base md:text-lg font-black font-sans ${isUser ? 'text-amber-600' : 'text-slate-800'}`}>
                      {member.pomodoros}
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-extrabold mr-1">جلسة بومودورو</span>
                  </div>
                  <span className="text-xs text-slate-300">|</span>
                  <span className="text-xs font-sans font-black text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-lg shrink-0">
                    {rankLabels[index] || `#${index + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100">
          <p className="text-xs md:text-sm text-slate-500 font-bold text-center leading-relaxed">
            💡 جميع الطلاب المسجلين بالمنصة تظهر أسماؤهم وتتحدث ترتيباتهم حقيقياً تلقائياً عند الدخول والاستخدام!
          </p>
        </div>
      </div>

    </div>
  );
}

