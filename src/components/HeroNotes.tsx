import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Search, 
  Pin, 
  Edit3, 
  Calendar, 
  Copy, 
  Download, 
  Tag, 
  BookOpen, 
  Sparkles, 
  Check, 
  ArrowUpDown,
  Filter,
  CheckSquare
} from 'lucide-react';
import { HeroNote } from '../types';

interface HeroNotesProps {
  currentUser: string;
}

const CATEGORY_PRESETS = [
  { id: 'all', label: 'الكل 📁', icon: BookOpen },
  { id: 'review', label: 'مراجعة عاجلة 🔔', icon: Sparkles },
  { id: 'idea', label: 'فكرة ذكية 💡', icon: Sparkles },
  { id: 'schedule', label: 'تنظيم ومواعيد 🗓️', icon: Calendar },
  { id: 'motivation', label: 'تشجيع لنفسي ✨', icon: Sparkles },
  { id: 'study', label: 'ملاحظة دراسية 📚', icon: BookMarked },
  { id: 'stress', label: 'تفريغ وفضفضة 🧘', icon: Sparkles },
];

const COLOR_PRESETS = [
  { id: 'border-amber-500 bg-amber-50/50 text-amber-800 accent-amber-500 fill-amber-500', label: 'ذهبي دافئ', hex: 'bg-amber-400' },
  { id: 'border-blue-500 bg-blue-50/50 text-blue-800 accent-blue-500 fill-blue-500', label: 'أزرق هادئ', hex: 'bg-blue-400' },
  { id: 'border-emerald-500 bg-emerald-50/50 text-emerald-800 accent-emerald-500 fill-emerald-500', label: 'أخضر يبعث الأمل', hex: 'bg-emerald-400' },
  { id: 'border-rose-500 bg-rose-50/50 text-rose-800 accent-rose-500 fill-rose-500', label: 'وردي حماسي', hex: 'bg-rose-400' },
  { id: 'border-indigo-500 bg-indigo-50/50 text-indigo-800 accent-indigo-500 fill-indigo-500', label: 'بنفسجي عميق', hex: 'bg-indigo-400' },
  { id: 'border-violet-500 bg-violet-50/50 text-violet-800 accent-violet-500 fill-violet-500', label: 'موف تركيز', hex: 'bg-violet-400' },
];

export default function HeroNotes({ currentUser }: HeroNotesProps) {
  const [notes, setNotes] = useState<HeroNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('review');
  const [color, setColor] = useState(COLOR_PRESETS[0].id);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  // UI state feedback
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load notes dynamically whenever user swaps
  useEffect(() => {
    if (currentUser) {
      const storedNotes = localStorage.getItem(`thanaweya_notes_${currentUser}`);
      if (storedNotes) {
        try {
          setNotes(JSON.parse(storedNotes));
        } catch (e) {
          setNotes([]);
        }
      } else {
        // Safe Initial Placeholder notes for new students
        const placeholders: HeroNote[] = [
          {
            id: 'p1',
            title: 'خريطة التفوق الذاتي ومعدلي القادم 🎓🚀',
            content: 'سأقوم بدراسة الفيزياء والكيمياء بمعدل 4 جلسات بومودورو يومياً.\nأهدافي حقيقية ولا مستحيل مع المذاكرة المستعينة بالله العظيم! تذكر الكلية الحلم يومياً عند الاستيقاظ.',
            category: 'motivation',
            createdAt: new Date().toISOString(),
            isPinned: true,
            color: COLOR_PRESETS[0].id
          },
          {
            id: 'p2',
            title: 'قوانين الفيزياء الحديثة الهامة للفحص 📝🔗',
            content: 'تذكر قوانين بلانك للتأثير الكهروضوئي:\nE = h.nu\nسرعة الضوء ثابت في الفراغ.\nمراجعة هامة مع الأستاذ يوم السبت القادم قبل بومودورو الفيزياء.',
            category: 'study',
            createdAt: new Date().toISOString(),
            isPinned: false,
            color: COLOR_PRESETS[1].id
          }
        ];
        setNotes(placeholders);
        localStorage.setItem(`thanaweya_notes_${currentUser}`, JSON.stringify(placeholders));
      }
    }
  }, [currentUser]);

  // Save notes helper
  const saveToLocalStorage = (updatedNotes: HeroNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(`thanaweya_notes_${currentUser}`, JSON.stringify(updatedNotes));
  };

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Handle note submission / update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (isEditingId) {
      // Edit mode
      const updated = notes.map(note => {
        if (note.id === isEditingId) {
          return {
            ...note,
            title: title.trim(),
            content: content.trim(),
            category,
            color,
            createdAt: new Date().toISOString() // updated time
          };
        }
        return note;
      });
      saveToLocalStorage(updated);
      setIsEditingId(null);
      triggerToast('تم تعديل مذكرتك بنجاح وبأمان! 📝💾');
    } else {
      // Create mode
      const newNote: HeroNote = {
        id: 'note_' + Date.now(),
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date().toISOString(),
        isPinned: false,
        color
      };
      saveToLocalStorage([newNote, ...notes]);
      triggerToast('تمت إضافة مذكرتك الجديدة وحفظها في جهازك! 💾✨');
    }

    // Reset fields
    setTitle('');
    setContent('');
    setCategory('review');
    setColor(COLOR_PRESETS[0].id);
  };

  // Pin / Unpin note
  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map(note => {
      if (note.id === id) {
        const nextState = !note.isPinned;
        triggerToast(nextState ? 'تم تثبيت المذكرة في القمة بنجاح! 📌' : 'تم إلغاء تثبيت المذكرة. 🏷️');
        return { ...note, isPinned: nextState };
      }
      return note;
    });
    saveToLocalStorage(updated);
  };

  // Delete note
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه المذكرة نهائياً؟')) {
      const updated = notes.filter(note => note.id !== id);
      saveToLocalStorage(updated);
      triggerToast('تم حذف المذكرة بنجاح. 🗑️');
      if (isEditingId === id) {
        setIsEditingId(null);
        setTitle('');
        setContent('');
      }
    }
  };

  // Edit action
  const handleStartEdit = (note: HeroNote) => {
    setIsEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setColor(note.color);
    window.scrollTo({ top: document.getElementById('notes-add-form-anchor')?.offsetTop || 350, behavior: 'smooth' });
    triggerToast('تم تحميل المذكرة للاستكمال والتعديل! 📝✍️');
  };

  // Copy Note function
  const handleCopyNote = (note: HeroNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `• ${note.title}\n${note.content}\n\n[حُفظت عبر مذكرات البطل 🎓 - رفيق الثانوية العامة]`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedId(note.id);
      triggerToast('تم نسخ كامل المذكرة للحافظة! 📋🔗');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Export note to txt format
  const handleExportNote = (note: HeroNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `==================================
  مذكرات البطل: ${note.title}
  التصنيف: ${CATEGORY_PRESETS.find(p => p.id === note.category)?.label || note.category}
  التاريخ: ${new Date(note.createdAt).toLocaleString('ar-EG')}
==================================

${note.content}

----------------------------------
تم التصدير من "رفيق الثانوية العامة" 🎓
دليل دراستك للوصول إلى القمة بلا تشتت.
    `;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, '_')}_ملاحظات_البطل.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('تم تصدير وتحميل مذكرتك بصيغة ملف نصي! 💾📄');
  };

  // Filter & Search Logic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === 'all' || note.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic (pinned always comes first, then sort by date)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Calculate statistics
  const totalNotes = notes.length;
  const pinnedCount = notes.filter(n => n.isPinned).length;
  const reviewCount = notes.filter(n => n.category === 'review').length;
  const studyCount = notes.filter(n => n.category === 'study').length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 mt-8 border border-slate-100 shadow-sm" dir="rtl" id="notes-module">
      {/* Title & Introductory banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
        <div className="text-right">
          <h3 className="text-xl font-extrabold text-slate-800 font-display flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-emerald-500 animate-pulse" />
            <span>مذكرات وأفكار البطل اليومية 📝📒</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs mt-1.5 leading-relaxed max-w-xl">
            سجل قائمة مهام مستعجلة، ملخصات سريعة، أو أفكار طارئة أثناء المذاكرة. تُحفظ هذه البيانات الحيوية محلياً بشكل مستقل لكل بطل!
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-100/80 p-3 rounded-2xl shrink-0 items-center gap-4 text-xs font-bold leading-normal">
          <div className="text-center px-2">
            <span className="text-slate-400 block text-[10px]">إجمالي المذكرات</span>
            <span className="text-lg font-black text-slate-800">{totalNotes}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center px-1">
            <span className="text-slate-400 block text-[10px]">ملاحظات مثبتة</span>
            <span className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
              <Pin className="w-3 h-3 fill-amber-500 text-amber-500" /> {pinnedCount}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center px-1">
            <span className="text-slate-400 block text-[10px]">مراجعات هامة</span>
            <span className="text-lg font-black text-red-500">{reviewCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* RIGHT COLUMN: Interactive Note Creater / Editor FORM */}
        <div className="lg:col-span-1 bg-slate-50/50 p-5 rounded-[2rem] border border-slate-100 scroll-mt-24" id="notes-add-form-anchor">
          <h4 className="font-extrabold text-slate-800 text-sm mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>{isEditingId ? 'تعديل مذكرتك المفتوحة ✨✍️' : 'تدوين فكرة أو تذكير جديد مريح 💡'}</span>
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-extrabold block">العنوان أو الفكرة الرئيسية 🏷️:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنواناً معبراً ومحفزاً..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none font-bold text-xs text-slate-800 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-extrabold block">الملاحظات أو التفاصيل الكاملة ✍️:</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب هنا كل ما يخطر ببالك.. قواعد، ملخصات، دفعة أمل، أو دروس مستعجلة للمذاكرة اليوم..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none font-bold text-xs text-slate-700 leading-relaxed placeholder:text-slate-400 shadow-sm resize-none"
              />
            </div>

            {/* Category presets */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-extrabold block">تصنيف ونوع المذكرة 📁:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none font-bold text-xs text-slate-700 shadow-sm"
              >
                {CATEGORY_PRESETS.filter(p => p.id !== 'all').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Accent Color selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-extrabold block">اللون المميز للكارت البصري 🎨:</label>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = color === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setColor(p.id)}
                      className={`w-8 h-8 rounded-full ${p.hex} cursor-pointer transition-all border-2 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 ${
                        isSelected ? 'border-indigo-600 scale-110 ring-2 ring-indigo-200' : 'border-white'
                      }`}
                      title={p.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm font-black" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit / Cancel buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4" />
                <span>{isEditingId ? 'تأكيد التعديل 💾' : 'حفظ المذكرة للنشاط 🚀'}</span>
              </button>
              
              {isEditingId && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingId(null);
                    setTitle('');
                    setContent('');
                    setCategory('review');
                    setColor(COLOR_PRESETS[0].id);
                    triggerToast('تم إلغاء التعديل بنجاح 💫');
                  }}
                  className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

          </form>
        </div>

        {/* LEFT COLUMN: Notes Search, Filter and Interactive Display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BAR: Search, Filters & Sorting Controls */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3.5 justify-between items-start sm:items-center">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو محتوى المذكرة..."
                className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-xs font-bold text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Right filter details */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Order toggler */}
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                title="تغيير اتجاه التاريخ"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{sortBy === 'newest' ? 'الأحدث أولاً' : 'الأقدم أولاً'}</span>
              </button>

              {/* Reset to defaults helper */}
              {(searchQuery || selectedFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-extrabold"
                >
                  تصفير الفلترة 🔄
                </button>
              )}
            </div>
          </div>

          {/* TAB BAR FILTERS BY COMPREHENSIVE CATEGORIES */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin select-none max-w-full" dir="rtl">
            {CATEGORY_PRESETS.map((p) => {
              const count = p.id === 'all' 
                ? notes.length 
                : notes.filter(n => n.category === p.id).length;
              const isSelected = selectedFilter === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedFilter(p.id)}
                  className={`py-1.5 px-3.5 h-8 rounded-full text-xs font-extrabold cursor-pointer border transition flex items-center gap-1.5 shrink-0 hover:scale-[1.02] ${
                    isSelected 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm font-black' 
                      : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{p.label}</span>
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-white text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* NOTES GRID DISPLAY LIST WITH ANIMATIONS */}
          {sortedNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {sortedNotes.map((note) => {
                  const matchingPreset = CATEGORY_PRESETS.find(cat => cat.id === note.category);
                  const displayCategory = matchingPreset ? matchingPreset.label : note.category;
                  const formattedDate = new Date(note.createdAt).toLocaleDateString('ar-EG', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <motion.div
                      key={note.id}
                      layoutId={`note-card-${note.id}`}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${note.color} hover:shadow-md hover:scale-[1.01]`}
                    >
                      {/* Pinned visual icon ribbon */}
                      {note.isPinned && (
                        <div className="absolute top-2 left-2 text-amber-500 bg-white/70 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-amber-200/50">
                          <Pin className="w-4 h-4 fill-amber-500 text-amber-500 rotate-[45deg]" />
                        </div>
                      )}

                      {/* Header and tag */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs font-extrabold bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/50 text-slate-700">
                            {displayCategory}
                          </span>
                        </div>
                        
                        <h5 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                          {note.title}
                        </h5>

                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-bold bg-white/40 p-2.5 rounded-xl border border-slate-100/30">
                          {note.content}
                        </p>
                      </div>

                      {/* Bottom Footer Section */}
                      <div className="mt-4 pt-3.5 border-t border-slate-200/50 flex items-center justify-between gap-1">
                        {/* Creation Time info */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>

                        {/* Interactive Toolbar Actions with Tooltips */}
                        <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
                          
                          {/* Pin toggle */}
                          <button
                            type="button"
                            onClick={(e) => togglePin(note.id, e)}
                            className="p-1 px-1.5 rounded-lg bg-white hover:bg-amber-100 border border-slate-200/60 transition cursor-pointer text-slate-500 hover:text-amber-600"
                            title={note.isPinned ? "إلغاء التثبيت 📌" : "تثبيت المذكرة في القمة 📌"}
                          >
                            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>

                          {/* Copy code content */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyNote(note, e)}
                            className="p-1 px-1.5 rounded-lg bg-white hover:bg-indigo-150 border border-slate-200/60 transition cursor-pointer text-slate-500 hover:text-indigo-600"
                            title="نسخ المذكرة كاملة 📋"
                          >
                            {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {/* Export File action */}
                          <button
                            type="button"
                            onClick={(e) => handleExportNote(note, e)}
                            className="p-1 px-1.5 rounded-lg bg-white hover:bg-emerald-100 border border-slate-200/60 transition cursor-pointer text-slate-500 hover:text-emerald-700"
                            title="تنزيل كملف نصي مستقل 📄"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit content */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(note)}
                            className="p-1 px-1.5 rounded-lg bg-white hover:bg-blue-100 border border-slate-200/60 transition cursor-pointer text-slate-500 hover:text-blue-600"
                            title="تعديل المذكرة ✍️"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete content */}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(note.id, e)}
                            className="p-1 px-1.5 rounded-lg bg-white hover:bg-rose-100 border border-slate-200/60 transition cursor-pointer text-slate-500 hover:text-rose-600"
                            title="حذف المذكرة نهائياً 🗑️"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-slate-50 p-12 text-center rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center gap-4 text-slate-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-slate-100 shadow-sm text-slate-400">
                <Search className="w-6 h-6 leading-none" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-slate-700 text-sm">مفيش أي مذكرات هنا حالياً! ✨</h5>
                <p className="text-xs max-w-sm font-semibold text-slate-500">
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'لم نعثر على أي مطابقة للبحث الحالي أو التصنيفات المحددة. جرب فلترة مغايرة.' 
                    : 'ابدأ الآن بكتابة أولى أفكارك أو تذكير مريح لتضمن حفظه محلياً على جهازك! يمكنك تثبيته في الأعلى للرجوع إليه دائماً.'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Manual Data Save Confirmation Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md bg-gradient-to-l from-emerald-600 to-teal-500 p-4 border border-emerald-500/30 rounded-2xl text-white shadow-xl z-50 flex items-center justify-between gap-3 font-bold text-xs leading-relaxed"
          >
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowSaveToast(false)}
              className="px-2 py-1 bg-white/20 hover:bg-white text-white hover:text-emerald-700 rounded-lg text-[10px] font-black cursor-pointer transition shrink-0"
            >
              حسناً 👍
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
