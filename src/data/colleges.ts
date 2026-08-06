// Egyptian Governorates and their Colleges Database by Highschool Branch
export interface CollegeItem {
  id: string;
  name: string;
  university: string;
  governorate: string;
  branch: 'science' | 'math' | 'literature';
  estScore: number; // Encouraged custom score target (e.g. 91% for Med)
  note: string;
}

export const EGYPTIAN_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'القليوبية',
  'الإسكندرية',
  'الدقهلية',
  'الغربية',
  'الشرقية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء'
];

// Quick popular recommendations by branch
export const POPULAR_COLLEGES_BY_BRANCH: Record<'science' | 'math' | 'literature', { name: string, score: number }[]> = {
  science: [
    { name: 'طب بشري قصر العيني', score: 91.5 },
    { name: 'طب أسنان القاهرة', score: 90.8 },
    { name: 'علاج طبيعي كفر الشيخ', score: 89.2 },
    { name: 'صيدلة عين شمس', score: 89.5 },
    { name: 'طب بيطري المنصورة', score: 86.0 },
    { name: 'علوم القاهرة', score: 82.5 },
    { name: 'تمريض طنطا', score: 71.0 }
  ],
  math: [
    { name: 'هندسة القاهرة', score: 84.5 },
    { name: 'هندسة عين شمس', score: 83.8 },
    { name: 'حاسبات ومعلومات عين شمس (ذكاء اصطناعي)', score: 80.5 },
    { name: 'حاسبات معلومات المنصورة', score: 79.2 },
    { name: 'فنون تطبيقية حلوان', score: 77.0 },
    { name: 'هندسة حلوان (المطرية)', score: 81.3 },
    { name: 'تخطيط عمراني القاهرة', score: 78.5 }
  ],
  literature: [
    { name: 'اقتصاد وعلوم سياسية القاهرة', score: 83.0 },
    { name: 'ألسن عين شمس', score: 80.5 },
    { name: 'إعلام القاهرة', score: 79.5 },
    { name: 'آثار القاهرة', score: 75.0 },
    { name: 'تربية عين شمس', score: 71.5 },
    { name: 'آداب الإسكندرية', score: 62.0 },
    { name: 'حقوق القاهرة', score: 60.0 },
    { name: 'تجارة حلوان', score: 63.5 }
  ]
};

export const COLLEGES_DATABASE: CollegeItem[] = [
  // --- CAIRO (القاهرة) ---
  // Science
  { id: 'c-med-pc', name: 'كلية الطب البشري', university: 'جامعة القاهرة (قصر العيني)', governorate: 'القاهرة', branch: 'science', estScore: 91.5, note: 'أعرق كليات الطب في الشرق الأوسط وبها مستشفيات قصر العيني التعليمية الضخمة.' },
  { id: 'c-med-as', name: 'كلية الطب البشري', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'science', estScore: 91.2, note: 'كلية عريقة وذات سمعة متميزة في البحث والأقسام الإكلينيكية.' },
  { id: 'c-med-hw', name: 'كلية الطب البشري', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'science', estScore: 90.5, note: 'كلية حديثة ومتطورة في التدريس ومستشفى بدر الجامعي.' },
  { id: 'c-dent-pc', name: 'كلية طب الفم والأسنان', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'science', estScore: 90.8, note: 'مبنى وأبحاث متميزة وتخريج كوادر أسنان قوية.' },
  { id: 'c-dent-as', name: 'كلية طب الفم والأسنان', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'science', estScore: 90.6, note: 'أقسام مجهزة ومتميزة بخدماتها العلاجية.' },
  { id: 'c-phar-pc', name: 'كلية الصيدلة', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'science', estScore: 89.5, note: 'تتيح برامج الفارمد والكلينيكال المتميزة.' },
  { id: 'c-phar-as', name: 'كلية الصيدلة', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'science', estScore: 89.2, note: 'مراكز تصنيع دواء وتحاليل صيدلانية متكاملة.' },
  { id: 'c-phar-hw', name: 'كلية الصيدلة', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'science', estScore: 88.8, note: 'صيدلة كلينيكال وحيوية مجهزة ومجال صناعة أدوية متميز.' },
  { id: 'c-phys-pc', name: 'كلية العلاج الطبيعي', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'science', estScore: 89.2, note: 'رائدة العلاج الطبيعي والتأهيل بمصر.' },
  { id: 'c-nurs-as', name: 'كلية التمريض', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'science', estScore: 71.0, note: 'توفر مجالات عمل سريعة جداً ومضمونة فور التخرج براتب رائع.' },
  { id: 'c-sci-pc', name: 'كلية العلوم', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'science', estScore: 82.5, note: 'منبع العلماء وبها تخصصات كيمياء حيوية وبيولوجيا فريدة.' },
  
  // Math
  { id: 'm-eng-pc', name: 'كلية الهندسة', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'math', estScore: 84.5, note: 'أقدم وأشهر مدرسة هندسة في مصر بأقسام الطيران والاتصالات والتصميم.' },
  { id: 'm-eng-as', name: 'كلية الهندسة', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'math', estScore: 83.8, note: 'أقسام الميكانيكا، العمارة والاتصالات بشهرة واسعة على مستوى الوطن العربي.' },
  { id: 'm-eng-hw', name: 'كلية الهندسة والذكاء الاصطناعي', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'math', estScore: 81.5, note: 'وتشمل الهندسة التكنولوجية الرائعة بحلوان.' },
  { id: 'm-eng-mataria', name: 'كلية الهندسة بالمطرية', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'math', estScore: 81.0, note: 'قسم السيارات والقوى الميكانيكية والعمارة الأفضل تاريخياً.' },
  { id: 'm-comp-pc', name: 'كلية الحاسبات والذكاء الاصطناعي', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'math', estScore: 81.0, note: 'رائدة مجالات البرمجة والأمن السيبراني والذكاء الاصطناعي بمصر.' },
  { id: 'm-comp-as', name: 'كلية الحاسبات والمعلومات', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'math', estScore: 80.5, note: 'برامج مشتركة قوية، ذكاء اصطناعي، وهندسة برمجيات عالية الطلب عالمياً.' },
  { id: 'm-comp-hw', name: 'كلية الحاسبات والذكاء الاصطناعي', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'math', estScore: 79.5, note: 'برمجيات، وسائط متعددة، ونظم معلومات متميزة.' },
  { id: 'm-urban-pc', name: 'كلية التخطيط العمراني', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'math', estScore: 78.5, note: 'الكلية الفريدة والوحيدة في مصر المتخصصة بالكامل في التخطيط والتصميم السكني.' },
  { id: 'm-arts-hw', name: 'كلية الفنون التطبيقية', university: 'جامعة حلوان', governorate: 'القاهرة', branch: 'math', estScore: 77.0, note: 'كلية الابتكار والتصميم والديكور بفرص توظيف قياسية.' },

  // Literature
  { id: 'l-econ-pc', name: 'كلية الاقتصاد والعلوم السياسية', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'literature', estScore: 83.0, note: 'قمة كليات الأدبي في مصر لتخريج الوزراء، الدبلوماسيين، والسفراء الرواد.' },
  { id: 'l-alsun-as', name: 'كلية الألسن', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'literature', estScore: 80.5, note: 'رائدة اللغات والترجمة الفورية والأبحاث اللغوية على مستوى الشرق الأوسط.' },
  { id: 'l-mc-pc', name: 'كلية الإعلام', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'literature', estScore: 79.5, note: 'أم كليات الإعلام لتخريج كبار الإعلاميين والصحفيين والمذيعين.' },
  { id: 'l-arch-pc', name: 'كلية الآثار', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'literature', estScore: 75.0, note: 'دراسات فرعونية، ترميم، إرشاد سياحي ذو سمعة جبارة عالمياً.' },
  { id: 'l-edu-as', name: 'كلية التربية', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'literature', estScore: 71.5, note: 'بناء الأجيال بالتربية الحديثة ومناهج التدريس الحديثة.' },
  { id: 'l-arts-pc', name: 'كلية الآداب', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'literature', estScore: 65.0, note: 'تخصصات علم النفس، اللغات الشرقية، والترجمة المتميزة.' },
  { id: 'l-comm-pc', name: 'كلية التجارة', university: 'جامعة القاهرة', governorate: 'القاهرة', branch: 'literature', estScore: 64.0, note: 'تخصصات محاسبة، إدارة أعمال، وإحصاء بطلب هائل في البنوك.' },
  { id: 'l-law-as', name: 'كلية الحقوق', university: 'جامعة عين شمس', governorate: 'القاهرة', branch: 'literature', estScore: 61.0, note: 'الشريعة والقانون والعلوم القانونية الكبرى لمجالات القضاء والمحاماة.' },

  // --- GIZA (الجيزة) ---
  // Note: Giza overlaps with CA Univ but can also include other aspects
  { id: 'g-vet-pc', name: 'كلية الطب البيطري', university: 'جامعة القاهرة (العجوزة/الجيزة)', governorate: 'الجيزة', branch: 'science', estScore: 85.8, note: 'صرح جبار للأبحاث الحيوانية والصحة والسلامة الغذائية.' },
  { id: 'g-comp-it', name: 'كلية الحاسبات والمعلومات', university: 'جامعة القاهرة', governorate: 'الجيزة', branch: 'math', estScore: 81.0, note: 'تقع بقلب الجيزة قرب الحرم الرئيسي.' },
  { id: 'g-arts-fa', name: 'كلية التربية النوعية والفنون المتطورة', university: 'جامعة القاهرة', governorate: 'الجيزة', branch: 'literature', estScore: 62.0, note: 'تضم تخصصات فنية وإعلامية متميزة.' },

  // --- ALEXANDRIA (الإسكندرية) ---
  // Science
  { id: 'al-med', name: 'كلية الطب البشري', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'science', estScore: 91.0, note: 'مباني حديثة ومستشفى المواساة وبحر من العلم المتميز.' },
  { id: 'al-dent', name: 'كلية طب الأسنان', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'science', estScore: 90.5, note: 'توفر تدريب عملي قوي جداً وخدمات وقائية.' },
  { id: 'al-phar', name: 'كلية الصيدلة', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'science', estScore: 89.0, note: 'صيدلة كلينيكال ومعامل صيدلانية متقدمة للغاية والبحث العلمي.' },
  { id: 'al-nurs', name: 'كلية التمريض', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'science', estScore: 70.5, note: 'تخصصات العناية الحرجة والطوارئ الهامة.' },
  // Math
  { id: 'al-eng', name: 'كلية الهندسة', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'math', estScore: 83.5, note: 'أولى كليات الهندسة المصرية في هندسة الغزل والنسيج وهندسة الاتصالات والإنتاج.' },
  { id: 'al-comp', name: 'كلية الحاسبات وعلوم البيانات', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'math', estScore: 80.2, note: 'دراسات متطورة ومتميزة في علوم البيانات والذكاء الاصطناعي والشبكات.' },
  // Literature
  { id: 'al-econ', name: 'كلية الدراسات الاقتصادية والعلوم السياسية', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'literature', estScore: 81.5, note: 'كلية متطورة للغاية تدرس العلوم السياسية المعاصرة والمالية.' },
  { id: 'al-arts', name: 'كلية الآداب', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'literature', estScore: 62.0, note: 'أقسام لغات إنجليزية وفرنسية وصحافة متميزة وعلم اجتماع.' },
  { id: 'al-edu', name: 'كلية التربية', university: 'جامعة الإسكندرية', governorate: 'الإسكندرية', branch: 'literature', estScore: 70.0, note: 'إعداد المعلمين بأجود تقنيات ومناهج التدريس الحديثة.' },

  // --- QALYUBIA (القليوبية) ---
  // Science
  { id: 'ql-med', name: 'كلية الطب البشري', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'science', estScore: 90.7, note: 'سمعة ممتازة ومستشفيات بنها الجامعية التي تخدم الملايين.' },
  { id: 'ql-phys', name: 'كلية العلاج الطبيعي', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'science', estScore: 88.9, note: 'قسم علاج طبيعي رائد وأعضاء هيئة تدريس متميزين.' },
  { id: 'ql-vet', name: 'كلية الطب البيطري بمشتهر', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'science', estScore: 85.5, note: 'صرح علمي زراعي وبيطري رائع في مشتهر.' },
  // Math
  { id: 'ql-eng-b', name: 'كلية الهندسة ببنها', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'math', estScore: 81.3, note: 'أقسام مدني وميكانيكا ممتازة.' },
  { id: 'ql-eng-s', name: 'كلية الهندسة بشبرا', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'math', estScore: 82.0, note: 'الهندسة المرموقة لجامعة بنها والموجودة بحي شبرا بالقاهرة.' },
  { id: 'ql-comp', name: 'كلية الحاسبات والذكاء الاصطناعي', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'math', estScore: 79.0, note: 'برمجيات متطورة جداً وتخصصات برمجية للتحول الرقمي.' },
  // Literature
  { id: 'ql-arts', name: 'كلية الآداب ببنها', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'literature', estScore: 61.0, note: 'علوم لغوية واجتماعية ونفسية قوية.' },
  { id: 'ql-edu', name: 'كلية التربية ببنها', university: 'جامعة بنها', governorate: 'القليوبية', branch: 'literature', estScore: 69.5, note: 'تأهيل وتخريج المدرسين الكفء لمختلف المدارس ببلدنا.' },

  // --- DAKAHLIA (الدقهلية) ---
  // Science
  { id: 'dk-med', name: 'كلية الطب البشري', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'science', estScore: 91.3, note: 'عاصمة الطب في مصر! تتميز بمراكز الكلى والمسالك (مركز غنيم الشهير) ومراكز الجهاز الهضمي.' },
  { id: 'dk-dent', name: 'كلية طب الأسنان', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'science', estScore: 90.7, note: 'عيادات مجهزة بأحدث الكاميرات السنية والحشوات.' },
  { id: 'dk-phar', name: 'كلية الصيدلة', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'science', estScore: 89.3, note: 'سمعة دولية وبحوث صيدلانية قوية.' },
  { id: 'dk-vet', name: 'كلية الطب البيطري', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'science', estScore: 85.6, note: 'مزارع ومستشفيات للحيوانات مجهزة لتدريب الطلبة.' },
  // Math
  { id: 'dk-eng', name: 'كلية الهندسة', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'math', estScore: 82.5, note: 'أقسام ميكاترونكس، مدني، وعمارة بمستوى علمي رفيع.' },
  { id: 'dk-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'math', estScore: 79.8, note: 'مشاريع تخرج تكنولوجية فريدة تفوز بجوائز متميزة سنوياً.' },
  // Literature
  { id: 'dk-arts', name: 'كلية الآداب', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'literature', estScore: 62.5, note: 'مستوى أكاديمي رائع وصحافة وقسم إعلام متميز بالدلتا.' },
  { id: 'dk-law', name: 'كلية الحقوق', university: 'جامعة المنصورة', governorate: 'الدقهلية', branch: 'literature', estScore: 60.5, note: 'صرح قانوني شهير تخرج منه رموز الفقه القانوني بمصر.' },

  // --- GHARBIA (الغربية) ---
  // Science
  { id: 'gr-med', name: 'كلية الطب البشري', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'science', estScore: 90.9, note: 'مستشفيات طنطا الجامعية ومستوى دراسي وصحي فائق التميز بوسط الدلتا.' },
  { id: 'gr-dent', name: 'كلية طب الأسنان', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'science', estScore: 90.6, note: 'معامل طب أسنان حديثة تخدم محافظات الدلتا.' },
  { id: 'gr-phar', name: 'كلية الصيدلة', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'science', estScore: 89.1, note: 'برامج الصيدلة الإكلينيكية المتقدمة.' },
  { id: 'gr-nurs', name: 'كلية التمريض', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'science', estScore: 70.8, note: 'دراسة مرنة وقوية تفتح لك فوراً أبواب المستشفيات الحكومية والخاصة.' },
  // Math
  { id: 'gr-eng', name: 'كلية الهندسة', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'math', estScore: 81.8, note: 'أقسام هندسة الإنشاءات وهندسة القوى الميكانيكية بجودة عالية.' },
  { id: 'gr-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'math', estScore: 79.1, note: 'حاسبات ذكاء اصطناعي قوية بالدلتا.' },
  // Literature
  { id: 'gr-arts', name: 'كلية الآداب', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'literature', estScore: 61.5, note: 'دراسات إنسانية وأقسام لغات متميزة.' },
  { id: 'gr-edu', name: 'كلية التربية', university: 'جامعة طنطا', governorate: 'الغربية', branch: 'literature', estScore: 69.0, note: 'صانعة المعلمين وأقسام تعليم الطفولة المبدعة بالدلتا.' },

  // --- SHARQIA (الشرقية) ---
  // Science
  { id: 'sh-med', name: 'كلية الطب البشري', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'science', estScore: 91.0, note: 'كليّة كبرى ومستشفى الزقازيق الجامعي المرموق.' },
  { id: 'sh-dent', name: 'كلية طب الأسنان', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'science', estScore: 90.5, note: 'أحدث التجهيزات الطبية في محافظة الشرقية.' },
  { id: 'sh-phar', name: 'كلية الصيدلة', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'science', estScore: 89.0, note: 'أبحاث صيدلية ونباتات طبية عريقة.' },
  { id: 'sh-vet', name: 'كلية الطب البيطري', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'science', estScore: 85.4, note: 'تخريج أطباء بيطريين للإنتاج الحيواني ومراقبة جودة الغذاء.' },
  // Math
  { id: 'sh-eng', name: 'كلية الهندسة', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'math', estScore: 82.2, note: 'قوة الأقسام كالهندسة الإنشائية والميكانيكية والمياه.' },
  { id: 'sh-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'math', estScore: 79.4, note: 'بها كوادر فائزة في مسابقات البرمجة المحلية والوطنية.' },
  // Literature
  { id: 'sh-arts', name: 'كلية الآداب', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'literature', estScore: 62.0, note: 'أقسام اللغة العربية والتاريخ والخدمة الاجتماعية المريحة.' },
  { id: 'sh-edu', name: 'كلية التربية', university: 'جامعة الزقازيق', governorate: 'الشرقية', branch: 'literature', estScore: 69.8, note: 'مستوى متميز وبها كافة التخصصات والعلوم التدريسية.' },

  // --- MONUFIA (المنوفية) ---
  // Science
  { id: 'mn-med', name: 'كلية الطب البشري', university: 'جامعة المنوفية (شبين الكوم)', governorate: 'المنوفية', branch: 'science', estScore: 90.8, note: 'مستشفيات جامعية ومراكز كبد بمستوى عالمي بشبين الكوم.' },
  { id: 'mn-phar', name: 'كلية الصيدلة', university: 'جامعة المنوفية', governorate: 'المنوفية', branch: 'science', estScore: 89.0, note: 'كلية صيدلية متميزة وشركاء رائعون في التحاليل الطبية.' },
  { id: 'mn-vet', name: 'كلية الطب البيطري بالسادات', university: 'جامعة مدينة السادات', governorate: 'المنوفية', branch: 'science', estScore: 85.0, note: 'مدينة السادات البحثية والبيطرية الرائعة بمستشفياتها البيطرية الكبرى.' },
  // Math
  { id: 'mn-eng', name: 'كلية الهندسة بشبين الكوم', university: 'جامعة المنوفية', governorate: 'المنوفية', branch: 'math', estScore: 81.5, note: 'صرح قوي بأقسام هندسة الكهرباء وميكانيكا قوى وبقية التخصصات المعمارية.' },
  { id: 'mn-comp', name: 'كلية الحاسبات والمعلومات بشبين الكوم', university: 'جامعة المنوفية', governorate: 'المنوفية', branch: 'math', estScore: 78.8, note: 'علوم حاسوب ونظم معلومات وتطبيقات ذكية ممتازة.' },
  // Literature
  { id: 'mn-arts', name: 'كلية الآداب بشبين الكوم', university: 'جامعة المنوفية', governorate: 'المنوفية', branch: 'literature', estScore: 61.0, note: 'دراسات لغوية وترجمة وعلوم جغرافية واجتماعية.' },
  { id: 'mn-edu', name: 'كلية التربية بالسادات', university: 'جامعة مدينة السادات', governorate: 'المنوفية', branch: 'literature', estScore: 68.5, note: 'منارة علمية تخرج أجيالاً قادرة على التدريس والإبداع.' },

  // --- BEHEIRA (البحيرة) ---
  // Science
  { id: 'bh-phar', name: 'كلية الصيدلة بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'science', estScore: 88.9, note: 'توفر الصيدلة السريرية والعادية ومختبرات تصنيع حديثة.' },
  { id: 'bh-vet', name: 'كلية الطب البيطري بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'science', estScore: 85.2, note: 'بها قسم للأبحاث الزراعية والماشية لمحافظة البحيرة الزراعية الرائعة.' },
  // Math
  { id: 'bh-eng', name: 'كلية الهندسة بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'math', estScore: 81.2, note: 'أقسام الهندسة الإنشائية والمعمارية المميزة.' },
  { id: 'bh-comp', name: 'كلية الحاسبات والمعلومات بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'math', estScore: 78.5, note: 'حاسبات معلومات بدعم برمجيات الذكاء الاصطناعي الناشئ.' },
  // Literature
  { id: 'bh-arts', name: 'كلية الآداب بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'literature', estScore: 61.2, note: 'أقسام جغرافيا وخرائط وعلم نفس رائعة.' },
  { id: 'bh-edu', name: 'كلية التربية بدمنهور', university: 'جامعة دمنهور', governorate: 'البحيرة', branch: 'literature', estScore: 68.0, note: 'مبنى تعليمي مجهز لتنمية مهارات معلمين المستقبل.' },

  // --- KAFR EL-SHEIKH (كفر الشيخ) ---
  // Science
  { id: 'ks-med', name: 'كلية الطب البشري', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'science', estScore: 91.0, note: 'من أحدث وأرقى الجامعات في مصر مع تصميم معماري ومستشفى جامعي مبهر ومجلة علمية واسعة.' },
  { id: 'ks-dent', name: 'كلية طب الأسنان', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'science', estScore: 90.6, note: 'مستوى تجهيز كبين ومخبر متفوق يتفوق على كليات المنطقة.' },
  { id: 'ks-phar', name: 'كلية الصيدلة', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'science', estScore: 89.0, note: 'بحث علمي قوي ودراسة دواء نموذجية.' },
  { id: 'ks-phys', name: 'كلية العلاج الطبيعي', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'science', estScore: 89.1, note: 'أفضل كليات العلاج الطبيعي في الدلتا من حيث الأجهزة المتاحة.' },
  { id: 'ks-vet', name: 'كلية الطب البيطري', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'science', estScore: 85.3, note: 'جائزة أفضل كلية جودة دراسية بمصر في سنوات سابقة.' },
  // Math
  { id: 'ks-eng', name: 'كلية الهندسة', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'math', estScore: 81.6, note: 'تصميم عمارة ومدني حديث ومناهج هندسية قوية.' },
  { id: 'ks-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'math', estScore: 78.5, note: 'حوسبة وذكاء اصطناعي وأمن معلومات حديث بالدلتا.' },
  // Literature
  { id: 'ks-alsun', name: 'كلية الألسن', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'literature', estScore: 79.5, note: 'دراسة اللغات الأكثر طلباً كالإنجليزية والألمانية والصينية والفرنسية لتأهيلك للعمل فوراً.' },
  { id: 'ks-arts', name: 'كلية الآداب', university: 'جامعة كفر الشيخ', governorate: 'كفر الشيخ', branch: 'literature', estScore: 61.2, note: 'مواد تاريخية وفلسفية متميزة وجو دراسي هادئ للغاية.' },

  // --- DAMIETTA (دمياط) ---
  // Science
  { id: 'dm-med', name: 'كلية الطب البشري', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'science', estScore: 90.5, note: 'مبنى مميز بالحي الرابع بدمياط الجديدة ودرجة طبية عالية بوسط الهدوء الساحلي.' },
  { id: 'dm-phar', name: 'كلية الصيدلة', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'science', estScore: 88.9, note: 'تخريج صيادلة ذوي كفاءة علمية وتصنيعية ممتازة.' },
  // Math
  { id: 'dm-eng', name: 'كلية الهندسة', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'math', estScore: 81.4, note: 'برامج المدني والعمارة القريبة من المشاريع العقارية الكبرى.' },
  { id: 'dm-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'math', estScore: 78.4, note: 'نظم معلومات تخدم قطاعات التجارة الدياطية وصناعة الأثاث المتكاملة.' },
  // Literature
  { id: 'dm-arts', name: 'كلية الآداب', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'literature', estScore: 61.0, note: 'تغطي تخصصات علم الاجتماع واللغات والآثار الشرقية.' },
  { id: 'dm-edu', name: 'كلية التربية', university: 'جامعة دمياط', governorate: 'دمياط', branch: 'literature', estScore: 68.0, note: 'دراسات طفولة وتدريس أساسي وتأهيل متميز.' },

  // --- BENI SUEF (بني سويف) ---
  // Science
  { id: 'bs-med', name: 'كلية الطب البشري', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'science', estScore: 90.6, note: 'رائدة الطب في شمال الصعيد مع مشافي ومعدات ممتازة.' },
  { id: 'bs-dent', name: 'كلية طب الأسنان', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'science', estScore: 90.4, note: 'سمعة رائعة ومبنى متكامل مجهز عائلي لخدمات الفم والأسنان.' },
  { id: 'bs-phar', name: 'كلية الصيدلة', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'science', estScore: 88.8, note: 'صيدلة سريرية وبحوث تصنيع الدواء المتميزة.' },
  { id: 'bs-phys', name: 'كلية العلاج الطبيعي', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'science', estScore: 88.9, note: 'قاعدة فنية متينة وعيادات علاج طبيعي تخدم الصعيد.' },
  // Math
  { id: 'bs-eng', name: 'كلية الهندسة', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'math', estScore: 81.1, note: 'مشاريع تخرج هندسية رائدة لخدمة الصناعة في بني سويف والمدن الجديدة.' },
  { id: 'bs-comp', name: 'كلية الحاسبات والذكاء الاصطناعي', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'math', estScore: 78.3, note: 'قسم تكنولوجيا المعلومات ونمذجة ذكية متقدمة.' },
  // Literature
  { id: 'bs-alsun', name: 'كلية الألسن', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'literature', estScore: 79.2, note: 'مبنى لغات ممتاز لدراسة اللغات وتخريج المترجمين الممتازين في الصعيد.' },
  { id: 'bs-econ', name: 'كلية السياسة والاقتصاد', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'literature', estScore: 81.2, note: 'واحدة من 4 كليات سياسة واقتصاد حكومية بمصر وتوجه عالمي ممتاز.' },
  { id: 'bs-mc', name: 'كلية الإعلام', university: 'جامعة بني سويف', governorate: 'بني سويف', branch: 'literature', estScore: 78.0, note: 'كلية إعلام متكاملة لشمال الصعيد مع أستوديوهات إذاعة وبث متكاملة.' },

  // --- MINYA (المنيا) ---
  // Science
  { id: 'my-med', name: 'كلية الطب البشري', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'science', estScore: 90.6, note: 'كلية مرموقة بمستشفيات المنيا الجامعية وعلم متكامل لعروس الصعيد.' },
  { id: 'my-dent', name: 'كلية طب الأسنان', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'science', estScore: 90.3, note: 'أقسام متميزة وعيادات قوية بخبرة أساتذة المنيا.' },
  { id: 'my-phar', name: 'كلية الصيدلة', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'science', estScore: 88.7, note: 'تحليل أدوية وصناعة كلينيكال ومعامل حيوية.' },
  // Math
  { id: 'my-eng', name: 'كلية الهندسة', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'math', estScore: 81.0, note: 'هندسة معمارية وقوى وصناعية رائدة.' },
  { id: 'my-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'math', estScore: 78.2, note: 'نظم معلومات تخدم التحول التكنولوجي بالصعيد.' },
  // Literature
  { id: 'my-alsun', name: 'كلية الألسن', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'literature', estScore: 79.0, note: 'تدرس لغات العالم بجدية مع كبائن تدريب ترجمة فورية على أحسن مستوى.' },
  { id: 'my-arts', name: 'كلية الآداب', university: 'جامعة المنيا', governorate: 'المنيا', branch: 'literature', estScore: 61.0, note: 'صحافة وبحوث علم نفس وتاريخ عريق.' },

  // --- ASYUT (أسيوط) ---
  // Science
  { id: 'as-med', name: 'كلية الطب البشري', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'science', estScore: 91.0, note: 'قطب العلاج الطبي والصحي والقلب في محافظة أسيوط وعالم الصعيد بالكامل. مستشفيات ضخمة للغاية.' },
  { id: 'as-dent', name: 'كلية طب الأسنان', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'science', estScore: 90.5, note: 'تدريب عملي على الحالات بمشرط حقيقي وتأهيل سنّي متفوق.' },
  { id: 'as-phar', name: 'كلية الصيدلة', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'science', estScore: 88.9, note: 'من ركائز صيدلة الدواء بمصر ومعامل حديثة.' },
  { id: 'as-vet', name: 'كلية الطب البيطري', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'science', estScore: 85.1, note: 'رعاية صحية وتطبيقات بيطرية كبرى بالصعيد.' },
  // Math
  { id: 'as-eng', name: 'كلية الهندسة', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'math', estScore: 81.5, note: 'تمتاز بقسم هندسة المناجم والتعدين بالإضافة للأقسام الميكانيكية والمعمارية والمدنية العتيدة.' },
  { id: 'as-comp', name: 'كلية الحاسبات والمعلومات', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'math', estScore: 78.4, note: 'كلية متميزة ببرمجة وتطبيق البرمجيات.' },
  // Literature
  { id: 'as-arts', name: 'كلية الآداب', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'literature', estScore: 61.0, note: 'علوم فصحى ولغات شرقية وجغرافيا خرائطية متميزة.' },
  { id: 'as-edu', name: 'كلية التربية', university: 'جامعة أسيوط', governorate: 'أسيوط', branch: 'literature', estScore: 68.5, note: 'إعداد المعلمين بخبرة عالية ومناهج ممتازة بالصعيد.' },

  // --- SOHAG (سوهاج) ---
  // Science
  { id: 'so-med', name: 'كلية الطب البشري', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'science', estScore: 90.9, note: 'مستفى سوهاج القديم والجديد مباني ذات خدمات طبية فائقة الجودة وكوادر جراحين عظماء.' },
  { id: 'so-phar', name: 'كلية الصيدلة', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'science', estScore: 88.7, note: 'صيدلة علاجية متميزة بأبحاث ممتازة.' },
  // Math
  { id: 'so-eng', name: 'كلية الهندسة', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'math', estScore: 81.0, note: 'قسم المدني وقسم الكهرباء بإنتاج قوي وحوكمة عالية.' },
  { id: 'so-comp', name: 'كلية الحاسبات والذكاء الاصطناعي', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'math', estScore: 78.0, note: 'خدمات برمجية للطلبة ومختبرات تكنولوجية.' },
  // Literature
  { id: 'so-alsun', name: 'كلية الألسن', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'literature', estScore: 78.8, note: 'ترجمة لغات إنجليزية وفرنسية وإيطالية وعبرية بتميز هائل.' },
  { id: 'so-arts', name: 'كلية الآداب', university: 'جامعة سوهاج', governorate: 'سوهاج', branch: 'literature', estScore: 60.5, note: 'أقسام اللغة العربية والعلوم الإسلامية والجغرافيا والدراسات الاجتماعية بسوهاج.' }
];

// Fallback suggestions generator if governorate doesn't have custom items
export function getCollegesForBranchAndGov(branch: 'science' | 'math' | 'literature', gov: string): CollegeItem[] {
  // Filter exact matches in db
  const results = COLLEGES_DATABASE.filter(item => item.branch === branch && item.governorate === gov);
  if (results.length > 0) return results;

  // Otherwise, return generic placeholder list localized for that governorate
  const genericMed = { id: `gen-med-${gov}`, name: 'كلية العلوم الطبية والصحية والجامعات الإقليمية', university: `جامعة ${gov} (أو أقرب جامعة حكومية)`, governorate: gov, branch: 'science' as const, estScore: 82.5, note: 'برامج وتخصصات ممتازة متوفرة لأبناء المحافظة لتقليل الاغتراب.' };
  const genericEng = { id: `gen-eng-${gov}`, name: 'كلية التكنولوجيا والهندسة والعلوم التطبيقية', university: `جامعة ${gov} (أو أقرب جامعة حكومية)`, governorate: gov, branch: 'math' as const, estScore: 76.5, note: 'برامج تكنولوجيا برمجية ومشاريع مدنية قوية تخدم أقاليم المحافظة.' };
  const genericArts = { id: `gen-arts-${gov}`, name: 'كلية الآداب والتربية والعلوم الإنسانية', university: `جامعة ${gov} (أو أقرب جامعة حكومية)`, governorate: gov, branch: 'literature' as const, estScore: 60.0, note: 'أقسام دراسية مريحة ولغات بطلب واسع في المدارس وبيئة الأعمال المحلية.' };

  const genericEdu = { id: `gen-edu-${gov}`, name: 'كلية التربية العريقة والموازنة الجغرافية', university: `جامعة ${gov} (أو أقرب جامعة حكومية)`, governorate: gov, branch: 'literature' as const, estScore: 65.0, note: 'لتخريج معلمين ومعلمات أكفاء من أبناء المحافظة.' };

  if (branch === 'science') {
    return [
      { id: `gen-sci-${gov}`, name: 'كلية العلوم العامة والتطبيقية', university: `جامعة ${gov}`, governorate: gov, branch: 'science', estScore: 80.0, note: 'دراسات بيولوجية، كيميائية، فيزيائية ممتازة بأبسط الطرق.' },
      { id: `gen-nurs-${gov}`, name: 'كلية التمريض ومعاهد الرعاية', university: `جامعة ${gov}`, governorate: gov, branch: 'science', estScore: 70.0, note: 'فرص عمل مضمونة فورية وتدريب تطبيقي رائع.' },
      genericMed
    ];
  } else if (branch === 'math') {
    return [
      { id: `gen-comp-${gov}`, name: 'كلية الحاسبات والذكاء الاصطناعي', university: `جامعة ${gov}`, governorate: gov, branch: 'math', estScore: 77.5, note: 'لكتابة الأكواد ومستقبل تكنولوجيا المعلومات.' },
      { id: `gen-fac-${gov}`, name: 'كلية الفنون والتربية النوعية والتكنولوجيا', university: `جامعة ${gov}`, governorate: gov, branch: 'math', estScore: 71.0, note: 'مجالات الديكور الفني والرسم الصناعي والتصميم.' },
      genericEng
    ];
  } else {
    return [
      genericArts,
      genericEdu,
      { id: `gen-comm-${gov}`, name: 'كلية التجارة وإدارة الأعمال', university: `جامعة ${gov}`, governorate: gov, branch: 'literature', estScore: 62.0, note: 'المحاسبة مالي وأعمال والانتساب مجدي للغاية في ريادة المشاريع.' }
    ];
  }
}
