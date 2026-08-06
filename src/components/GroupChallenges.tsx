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
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  isUser?: boolean;
}

interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  currentCount: number;
  targetCount: number;
  pointsReward: number;
  isClaimed: boolean;
  type: string;
}

export default function GroupChallenges({ 
  userWeeklyPomodoros, 
  userName, 
  userBranch, 
  onAddPoints,
  onAddActivityLog
}: GroupChallengesProps) {
  // Balanced mock team member champions with customizable branch indicator descriptions
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: 'أحمد الشناوي', branch: 'علمي رياضة', pomodoros: 26, avatar: '👨‍💻' },
    { name: 'مي عبد الرحمن', branch: 'علمي علوم', pomodoros: 24, avatar: '👩‍⚕️' },
    { name: 'عبد الله القاضي', branch: 'أدبي', pomodoros: 21, avatar: '👨‍⚖️' },
    { name: 'منة الله رأفت', branch: 'علمي علوم', pomodoros: 17, avatar: '👩‍🔬' },
    { name: 'مريم الشافعي', branch: 'أدبي', pomodoros: 15, avatar: '👩‍🎨' }
  ]);

  // Combined and sorted leaderboard
  const [leaderboard, setLeaderboard] = useState<TeamMember[]>([]);

  // Weekly cooperative group challenges
  const [groupChallenges, setGroupChallenges] = useState<GroupChallenge[]>([
    {
      id: 'coop_pomo',
      title: 'تحدي فرسان القمة الدفعوي 🪐🏆',
      description: 'انجاز 100 جلسة بومودورو جماعية هذا الأسبوع لتشجيع رفاق الدفعة.',
      currentCount: 82,
      targetCount: 100,
      pointsReward: 50,
      isClaimed: false,
      type: 'pomodoro'
    },
    {
      id: 'coop_hours',
      title: 'رابطة المذاكرة الليلية اللامعة 🦉✨',
      description: 'دراسة ومراجعة 150 ساعة تركيز متواصلة كفريق واحد.',
      currentCount: 138,
      targetCount: 150,
      pointsReward: 70,
      isClaimed: false,
      type: 'hours'
    },
    {
      id: 'coop_quizzes',
      title: 'كتائب البوابات وحل البابل شيت 📝🎓',
      description: 'حل وإتقان 50 اختبار تقييمي رفيقي لمكافحة الأخطاء الكهربية والفكرية.',
      currentCount: 42,
      targetCount: 50,
      pointsReward: 60,
      isClaimed: false,
      type: 'quiz'
    }
  ]);

  // Build the leaderboard based on user and static colleagues
  useEffect(() => {
    const userBranchArabic = userBranch === 'science' 
      ? 'علمي علوم' 
      : userBranch === 'math' 
      ? 'علمي رياضة' 
      : userBranch === 'literature' 
      ? 'أدبي' 
      : 'عام';

    const userObj: TeamMember = {
      name: (userName || 'أنت البطل').trim() + ' (أنت)',
      branch: userBranchArabic,
      pomodoros: userWeeklyPomodoros,
      avatar: '⚡',
      isUser: true
    };

    // Combine and sort by highest pomodoros
    const combined = [...teamMembers, userObj]
      .sort((a, b) => b.pomodoros - a.pomodoros);
      
    setLeaderboard(combined);
  }, [userWeeklyPomodoros, userName, userBranch, teamMembers]);

  // Handle claiming cooperative rewards
  const handleClaimReward = (id: string, reward: number, title: string) => {
    setGroupChallenges(prev => prev.map(ch => {
      if (ch.id === id) {
        return { ...ch, isClaimed: true };
      }
      return ch;
    }));
    onAddPoints(reward);
    onAddActivityLog('badge_unlock', `كسبتم التحدي الجماعي الأسطوري: "${title}" وحصلت بشكل مشترك على ${reward} نقطة طاقة إضافية! 🎉🎓`);
  };

  // Dynamically augment the cooperative counts as the user studies (for a super responsive real feel)
  useEffect(() => {
    setGroupChallenges(prev => prev.map(ch => {
      if (ch.id === 'coop_pomo') {
        const base = 82 + userWeeklyPomodoros;
        return { ...ch, currentCount: Math.min(ch.targetCount, base) };
      }
      return ch;
    }));
  }, [userWeeklyPomodoros]);

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* Banner introduction with beautiful gradients */}
      <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-indigo-850 shadow-xl relative overflow-hidden text-right select-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-505/10 rounded-full filter blur-[120px] -mt-24 -ml-24 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[120px] -mb-20 -mr-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full font-black tracking-widest uppercase">
              التنافس الإيجابي والتعاون المذهل 🤝🚀
            </span>
            <h2 className="text-xl md:text-2xl font-black font-display leading-tight">
              تحديات المذاكرة الجماعية لعرش الثانوية العامة 🎓✨
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-bold max-w-xl leading-relaxed">
              تتبع ترتيبك التنافسي بين أصحابك وزملائك في الجمهورية، وشارك مع رفاقك في إنجاز التحديات التعاونية لفتح نقاط فخرية قوية للجميع! المذاكرة مع الصحبة الصالحة تهزم الكسل.
            </p>
          </div>
          <div className="p-4 bg-indigo-800/40 rounded-2xl border border-indigo-700/30 hidden md:block select-none transform hover:scale-105 duration-300 ease-out">
            <UsersRound className="w-14 h-14 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Challenge list and Top 5 Champions Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RIGHT COL: Leaderboard Top 5 Champions of the Week */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5">
              <div className="text-right">
                <h3 className="text-base font-extrabold text-slate-800 font-display flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>لوحة المتصدرين الأسبوعية (أفضل 5 أبطال) 🏆</span>
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1">المراكز الخمسة الأولى بناءً على عدد البومودورو المكتمل</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-black px-3 py-1 rounded-full border border-emerald-100">
                أسبوع متجدد ⏱️
              </span>
            </div>

            {/* Leaderboard table body */}
            <div className="space-y-3.5">
              {leaderboard.slice(0, 5).map((member, index) => {
                const rankLabels = ['الأول 👑', 'الثاني 🥈', 'الثالث 🥉', 'الرابع 🎖️', 'الخامس 🎖️'];
                const isUser = !!member.isUser;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isUser 
                        ? 'bg-amber-500/10 border-amber-300 shadow-md ring-2 ring-amber-500/5' 
                        : 'bg-slate-50 border-slate-100/80 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Index Badge with crown styling */}
                      <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${
                        index === 0 
                          ? 'bg-amber-500 text-slate-950 font-black text-sm shadow-md' 
                          : index === 1
                          ? 'bg-slate-300 text-slate-700'
                          : index === 2
                          ? 'bg-orange-200 text-orange-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {index + 1}
                      </div>

                      {/* Avatar */}
                      <span className="text-2xl">{member.avatar}</span>

                      {/* Name and Branch */}
                      <div className="text-right">
                        <h4 className={`text-xs md:text-sm font-black flex items-center gap-1.5 ${isUser ? 'text-amber-800' : 'text-slate-800'}`}>
                          <span>{member.name}</span>
                          {isUser && <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">بطل اليوم</span>}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">شعبة: {member.branch}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <div className="text-right">
                        <span className={`text-sm md:text-base font-black font-sans ${isUser ? 'text-amber-600' : 'text-slate-800'}`}>
                          {member.pomodoros}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans font-extrabold mr-1">جلسة</span>
                      </div>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-[10px] font-sans font-black text-amber-500 bg-amber-100/40 px-2 py-1 rounded-md shrink-0">
                        {rankLabels[index]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-150">
            <p className="text-xs text-slate-500 font-semibold text-center leading-relaxed">
              💡 أنجز المزيد من جلسات البومودورو الفعالة وراقب اسمك يرتفع لقمة المتصدرين فورياً!
            </p>
          </div>
        </div>

        {/* LEFT COL: Collaborative Cooperative Challenges */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5">
              <div className="text-right">
                <h3 className="text-base font-extrabold text-slate-800 font-display flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-indigo-500" />
                  <span>تطلعات التعاون الجماعي (الجميع يكسب) 🤝🌟</span>
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1">مجهود رفقاء الجمهورية يتراكم معاً للوصول للهدف الأقصى</p>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full border border-indigo-100">
                نشط ⚡
              </span>
            </div>

            {/* Challenges list */}
            <div className="space-y-4">
              {groupChallenges.map((ch) => {
                const isComplete = ch.currentCount >= ch.targetCount;
                return (
                  <div 
                    key={ch.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      ch.isClaimed 
                        ? 'bg-slate-50/70 border-slate-100 opacity-60' 
                        : isComplete 
                        ? 'bg-emerald-500/5 border-emerald-300' 
                        : 'bg-white border-slate-100/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs md:text-sm text-slate-800 flex items-center gap-1.5 leading-tight">
                          <span>{ch.title}</span>
                          {ch.isClaimed && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              تم استلام كنزك الجماعي 💎
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-sm">
                          {ch.description}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {!ch.isClaimed ? (
                          <button
                            type="button"
                            onClick={() => handleClaimReward(ch.id, ch.pointsReward, ch.title)}
                            disabled={!isComplete}
                            className={`w-full sm:w-auto py-2 px-3.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                              isComplete 
                                ? 'bg-gradient-to-l from-emerald-505 to-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                                : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200 font-bold'
                            }`}
                          >
                            <Award className="w-4 h-4" />
                            <span>استرد {ch.pointsReward} نقطة طاقة ⚡</span>
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-100/40 p-1.5 px-3 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>مكتمل</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress tracking line */}
                    {!ch.isClaimed && (
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100/60">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                          <span className="font-mono">الخصائص الجماعية: {ch.currentCount} / {ch.targetCount}</span>
                          <span>المقاييس: {Math.round((ch.currentCount / ch.targetCount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                            style={{ width: `${(ch.currentCount / ch.targetCount) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-150">
            <p className="text-xs text-slate-400 font-bold text-center italic">
              * مسهمتك الشخصية في بومودورو أو ساعات التركيز تنمي وتقدم التحديث التعاوني فورياً لدفعة أحلامك!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
