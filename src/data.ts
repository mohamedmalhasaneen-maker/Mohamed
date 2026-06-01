import { Badge, StudyChallenge } from './types';

// Academic subjects for Thanaweya Amma based on student branch selection
export const SUBJECTS_BY_BRANCH = {
  science: [
    'اللغة العربية',
    'اللغة الإنجليزية الأولى',
    'اللغة الأجنبية الثانية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'الجيولوجيا والعلوم البيئية',
    'التربية الدينية',
    'التربية الوطنية',
    'الاقتصاد والإحصاء'
  ],
  math: [
    'اللغة العربية',
    'اللغة الإنجليزية الأولى',
    'اللغة الأجنبية الثانية',
    'الفيزياء',
    'الكيمياء',
    'الرياضيات البحتة (جبر، هندسة فراغية، تفاضل وتكامل)',
    'الرياضيات التطبيقية (استاتيكا، ديناميكا)',
    'التربية الدينية',
    'التربية الوطنية',
    'الاقتصاد والإحصاء'
  ],
  literature: [
    'اللغة العربية',
    'اللغة الإنجليزية الأولى',
    'اللغة الأجنبية الثانية',
    'التاريخ',
    'الجغرافيا',
    'عالم النفس والاجتماع',
    'الفلسفة والمنطق',
    'التربية الدينية',
    'التربية الوطنية',
    'الاقتصاد والإحصاء'
  ],
  '': [
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'التاريخ',
    'الجغرافيا'
  ]
};

// Gamification Badges
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_task',
    title: 'خطوات المجد الأولى',
    description: 'أكمل أول مهمة دراسية في رفيق الثانوية.',
    iconName: 'Award',
    requiredPoints: 10
  },
  {
    id: 'first_pomodoro',
    title: 'مقاتل الدقائق',
    description: 'أكمل أول جلسة تركيز كاملة لمدة 25 دقيقة (بومودورو).',
    iconName: 'Timer',
    requiredPoints: 20
  },
  {
    id: 'thrice_task',
    title: 'حمّى الإنجاز',
    description: 'أنجز 3 مهام دراسية كاملة.',
    iconName: 'Zap',
    requiredPoints: 50
  },
  {
    id: 'ai_venter',
    title: 'الهدوء النفسي',
    description: 'تحدث مع رفيق الثانوية الذكي لتفريغ ضغطك وتلقي الدعم النفسي.',
    iconName: 'HeartHandshake',
    requiredPoints: 30
  },
  {
    id: 'focus_master',
    title: 'قاهر التشتت',
    description: 'أكمل 4 جلسات بومودورو لمذاكرة مركزة.',
    iconName: 'Flame',
    requiredPoints: 100
  },
  {
    id: 'ultimate_legend',
    title: 'بطل الثانوية العام',
    description: 'اجمع 200 نقطة طاقة وثبّت عزمك نحو حلمك.',
    iconName: 'Trophy',
    requiredPoints: 200
  }
];

// Study challenges to encourage student daily
export const INITIAL_CHALLENGES: StudyChallenge[] = [
  {
    id: 'ch_pomo_4',
    title: 'تحدي قاهر البومودورو ⚡',
    description: 'أكمل 4 جلسات تركيز (25 دقيقة لكل واحدة) بنجاح.',
    pointsReward: 50,
    targetCount: 4,
    currentCount: 0,
    category: 'pomodoro',
    isClaimed: false
  },
  {
    id: 'ch_tasks_3',
    title: 'تحدي وحش الإنجاز الثلاثي 📚',
    description: 'انهي 3 مهام دراسية من جدولك اليومي.',
    pointsReward: 30,
    targetCount: 3,
    currentCount: 0,
    category: 'tasks',
    isClaimed: false
  },
  {
    id: 'ch_vent_1',
    title: 'تحدي تفريغ الشحنات 🧠',
    description: 'اكتب ما تشعر به مرة واحدة في ركن الفضفضة والتأمل لتشحن طاقتك النفسية.',
    pointsReward: 15,
    targetCount: 1,
    currentCount: 0,
    category: 'vent',
    isClaimed: false
  }
];

// Confetti popup triggers
export const CELEBRATIONS = [
  "عاش يا بطل! مهمة كمان خلصت، الكلية اللي بتحلم بيها بتناديك! 🔥",
  "خطوة ممتازة! فخور بيك وبمجهودك، استمر ولا تتوقف.. الحلم يستاهل! 🌟",
  "وحش المذاكرة! أنت أقوى من أي مادة، يلا ندخل على المهمة اللي بعدها؟ 🚀",
  "الله ينور يا بطل! تعبك ده مش هيروح هدر، حصالة أحلامك بتتملي بنجاحك اليومي! 🎓",
  "إنجاز رائع! خطوة جديدة بتقربك للمجموع اللي بتحلم بيه.. كمل بعزيمة! 🎯",
  "بطل حقيقي! الكسل ملوش مكان هنا، فخورين بيك وبمثابرتك! 💖"
];

export function getRandomCelebration(): string {
  const index = Math.floor(Math.random() * CELEBRATIONS.length);
  return CELEBRATIONS[index];
}
