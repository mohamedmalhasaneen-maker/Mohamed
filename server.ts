import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { getFallbackLesson } from './fallbackLessons';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '500mb' })); // Support large document and high-resolution book uploads up to 500MB
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post('/api/generate-lesson', async (req, res) => {
  const { imageBase64, mimeType, textContent, studentProfile = {} } = req.body;
  try {
    if (!imageBase64 && !textContent) {
      return res.status(400).json({ error: 'الرجاء رفع صورة للمنهج أو إدخال نص الدرس للمتابعة.' });
    }

    const { branch, dreamCollege, name, title } = studentProfile;

    let userPrompt = `
قم بتحليل محتوى المنهج المرفق (سواء كان في الصورة أو النص المكتوب) وقم بتبسيطه وإنشاء شرح تفاعلي وبطاقات مراجعة واختبار اختيار من متعدد (MCQs) تفاعلي للطالب.
يجب أن تتحدث بلهجة "رفيق المذاكرة" الأسطوري للثانوية العامة والتعليم المصري، بأسلوب تشجيعي جداً، ودود، يتضمن أمثلة حياتية طريفة من الشارع المصري عند الشرح لتسهيل المفاهيم الصعبة، ومخاطبة الطالب باسمه (الاسم: ${name || 'بطل'}، اللقب: ${title || 'بطل الثانوية'}).

المخرجات المطلوبة كـ JSON مطابق للمخطط الهيكلي (responseSchema) الموضح أدناه:
- title: عنوان الدرس المستخلص من المرفق (مثال: "قانون أوم الكهربي" أو "أسلوب النداء").
- explanation: شرح تفصيلي ممتد ذكي ومبتكر للمفهوم:
  * title: عنوان الشرح التفاعلي.
  * content: ملخص دافئ ومحفز للدرس ككل وبسيط ومفصل يشرح الدرس بعميق الجوانب ومثالي جداً.
  * subPoints: قائمة بالنقاط الفرعية المفصلة (من 5 إلى 8 نقاط) لتشرح كل جزئية علمية بدقة ممتدة مع أمثلة تبسيطية خفيفة الدم.
- audioGuide: مقترح لدليل صوّتي:
  * title: عنوان التسجيل الصوتي المقترح (مثال: "كيف تظبط كيرشوف من أول مرة بدون لخبطة وتفهم كل تفاصيله").
  * duration: المدة المتوقعة للتسجيل بالدقائق (مثال: "12:15").
  * speaker: اسم المعلم الرفيق المقترح.
- takeaways: قائمة من 5 خلاصات/تنبيهات ذهبية جوهرية وعميقة.
- flashcards: قائمة تفاعلية شاملة مكثفة تتكون من 21 إلى 24 بطاقة مراجعة تفاعلية (سؤال وجواب) (يجب أن يكون العدد أكثر من 20 بطاقة مراجعة لضمان التغطية الشاملة للدرس) بحيث يكون السؤال في الـ "front" والتعريف أو الإجابة الشافية والدقيقة في الـ "back" للتكرار المتباعد.
- quiz: اختبار تفاعلي بابل شيت شامل ومفصل يتكون من 21 إلى 23 سؤالاً مميزاً اختيار من متعدد (MCQs) (يجب أن يكون العدد أكثر من 20 سؤالاً بالتمام والكمال لتلبية رغبة الطالب في الحل المكثف):
  * question: نص السؤال باللغة العربية بأسلوب الامتحانات الوزارية الحديثة وبنوك الأسئلة (البابل شيت) الذي يعتمد على الفهم والتفكير السليم والتركيز العالي.
  * options: أربعة خيارات واضحة للمستخدم.
  * correctIndex: مؤشر الخيار الصحيح (رقم بين 0 و 3).
  * explanation: تفسير علمي مبهج وشافٍ ومفصل لسبب صحة هذا الخيار بلهجة رفيقك الدافئة.

هام جداً لسلامة الإجابة:
- يرجى توليد شرح تفصيلي غني بالمعلومات ولا تختصر أي مفاهيم.
- تأكد تماماً وبكل دقة أن عدد البطاقات (flashcards) أكبر من 20 بطاقة (مثلاً 21 أو 22 بطاقة)، وعدد الأسئلة (quiz) أكبر من 20 سؤالاً (مثلاً 21 أو 22 سؤالاً).
- المخرجات باللغة العربية بشكل كامل.
`;

    // Construct contents in standard Gemini multimodal form
    const parts: any[] = [];
    
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      });
    }

    if (textContent) {
      parts.push({
        text: `محتوى المنهج النصي المكتوب:\n${textContent}\n`
      });
    }

    parts.push({ text: userPrompt });

    // Loop with exponential backoff for resilience against transient 503 load errors
    let responseText = "";
    let lastError: any = null;
    let maxAttempts = 3;
    let delay = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: { parts },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["title", "explanation", "audioGuide", "takeaways", "flashcards", "quiz"],
              properties: {
                title: { type: Type.STRING },
                explanation: {
                  type: Type.OBJECT,
                  required: ["title", "content", "subPoints"],
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    subPoints: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ["title", "text"],
                        properties: {
                          title: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                audioGuide: {
                  type: Type.OBJECT,
                  required: ["title", "duration", "speaker"],
                  properties: {
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    speaker: { type: Type.STRING }
                  }
                },
                takeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                flashcards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["front", "back"],
                    properties: {
                      front: { type: Type.STRING },
                      back: { type: Type.STRING }
                    }
                  }
                },
                quiz: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["question", "options", "correctIndex", "explanation"],
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            temperature: 0.2, // Fast deterministic generation
          }
        });

        if (response && response.text) {
          responseText = response.text;
          break; // Succeeded!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini generation attempt ${attempt} failed:`, err?.message || err);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5;
        }
      }
    }

    if (!responseText) {
      throw lastError || new Error("Generated content is empty");
    }

    const parsedData = JSON.parse(responseText || '{}');
    parsedData.id = `gen-lesson-${Date.now()}`;
    res.json({ lesson: parsedData });

  } catch (error: any) {
    console.error('Gemini error on generate-lesson, running graceful Egyptian curriculum fallback...', error);
    try {
      // In case of any transient Gemini error (including 503), construct a magnificent custom fallback lesson instantly.
      const fallbackLesson = getFallbackLesson(studentProfile?.branch || 'science', textContent || '');
      // Mark as fallback so the student is notified but still has a 100% active operational lesson
      (fallbackLesson as any).id = `gen-lesson-fallback-${Date.now()}`;
      
      console.log(`Successfully generated premium offline fallback lesson: "${fallbackLesson.title}"`);
      res.json({ lesson: fallbackLesson });
    } catch (fallbackErr: any) {
      console.error('Fatal error generating fallback lesson:', fallbackErr);
      res.status(500).json({ error: 'عذراً يا بطل! خادم الذكاء الاصطناعي مجهد حالياً ولم نتمكن من توليد الدرس تلقائياً. يرجى المحاولة بعد قليل وثق أننا نبذل قصارى جهدنا لمساعدتك!' });
    }
  }
});


app.post('/api/vent', async (req, res) => {
  try {
    const { message, previousMessages = [], studentProfile = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'الرجاء إدخال رسالة مفعمة بالنشاط.' });
    }

    const { branch, dreamCollege, targetScore, studyTime, title, name } = studentProfile;
    
    let contextPrompt = "";
    if (branch || dreamCollege || targetScore || studyTime || title || name) {
      const arabicBranch = branch === 'science' ? 'علمي علوم' : branch === 'math' ? 'علمي رياضة' : branch === 'literature' ? 'أدبي' : branch;
      const arabicTime = studyTime === 'morning' ? 'الصباح' : studyTime === 'evening' ? 'المساء' : studyTime;
      contextPrompt = `\n[بيانات الطالب للنداء والتحفيز: الاسم: ${name || 'بطل'}، اللقب المفضل: ${title || 'بطل الثانوية'}، الشعبة: ${arabicBranch || 'عامة'}، الكلية المستهدفة: ${dreamCollege || 'القمة'}، المجموع المستهدف: ${targetScore || '100'}٪، أفضل وقت للتركيز: ${arabicTime || 'مستمر'}].\n`;
    }

    // Build alternating contents array that MUST start with user
    const rawHistory = previousMessages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      text: msg.text
    }));

    // Add current user message
    rawHistory.push({
      role: 'user',
      text: message + (contextPrompt ? contextPrompt : '')
    });

    const contents: any[] = [];
    let nextExpectedRole = 'user';

    for (const msg of rawHistory) {
      if (msg.role === nextExpectedRole) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
        nextExpectedRole = nextExpectedRole === 'user' ? 'model' : 'user';
      }
    }

    if (nextExpectedRole === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: message + (contextPrompt ? contextPrompt : '') }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `أنت النموذج اللغوي المطور والذكي "رفيق الثانوية وبطل المذاكرة" (المبني بالكامل كـ Gemini AI ذكي وعميق جداً).
أنت لست رفيق فضفضة ودعم نفسي فقط، بل أنت عقل أكاديمي جبار يستطيع إجابة وشرح وحل أي مادة علمية، أدبية، لغات، كيمياء، أحياء، فيزياء، مسائل رياضيات معقدة، كتابة أكواد، وضع جداول مذاكرة مخصصة تفصيلية، وتلخيص كتب كاملة، وشرح قواعد النحو الإنجليزي والعربي والفرنسي، وحل أي أسئلة صعبة مع ذكر المبرر العلمي.

مطلوب منك الإجابة بأسلوب ذكي للغاية، ممتع، مقنع، دافئ بنكهة ولهجة مصرية، مع نداء الطالب بلقبه المحبب دائماً (${title || 'بطل الثانوية'}).

قواعد بالغة الأهمية للرد والسرعة الخارقة:
1. رد بسرعة بالغة: تجنب التكرار والهذر والمقدمات الطويلة التي تستهلك مدة الاستجابة. ادخل في صلب الموضوع أو الحل الأكاديمي فوراً.
2. أجب على أي وكل الأسئلة التي يطرحها الطالب إجابة وافية ودقيقة مثل نموذج Gemini AI الأصلي دون قيود أو ادعاء العجز.
3. اكتب ردودك بشكل مهندم ومنظم جداً (استخدم الترقيم البسيط، السطور الجديدة المريحة، والحلول الواضحة خطوة بخطوة).
4. امزج العلم بالتحفيز والدعم المعنوي والتشجيع لتمنحه الطاقة الإيجابية ليتغلب على تعبه وتراكم مكسباته!
5. تحدث بلهجة الصديق الخبير الحكيم الذكي والشاطر جداً.`,
        temperature: 0.5,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini error, using backend fallback:', error);
    
    // Generate beautiful helpful Egyptian fallback response
    const { message, studentProfile = {} } = req.body;
    const msg = (message || "").toLowerCase();
    const name = studentProfile.name || 'يا بطل';
    const college = studentProfile.dreamCollege || 'الكلية اللي بتتمناها';
    const branchText = studentProfile.branch === 'science' ? 'الأحياء والعلوم' : studentProfile.branch === 'math' ? 'الرياضيات والمسائل' : 'المواد الأدبية';

    const isAnxious = msg.includes('خايف') || msg.includes('خوف') || msg.includes('قلق') || msg.includes('توتر') || msg.includes('مرعوب');
    const isLazy = msg.includes('مكسل') || msg.includes('تعبان') || msg.includes('ملل') || msg.includes('زهقت') || msg.includes('مش قادر');
    const isDream = msg.includes('حلم') || msg.includes('طب') || msg.includes('هندسة') || msg.includes('مجموع') || msg.includes('نتيجة') || msg.includes('كلية');
    const isLost = msg.includes('ضايع') || msg.includes('تراكم') || msg.includes('متأخر') || msg.includes('نسيت') || msg.includes('مش فاكر');
    const isGreeting = msg.includes('أهلاً') || msg.includes('اهلا') || msg.includes('سلام') || msg.includes('ازيك') || msg.includes('مرحبا') || msg.includes('هاي');

    let reply = "";
    if (isAnxious) {
      reply = `يا ${name}، طبيعي جداً تحس بقلق في المرحلة دي! الخوف ده معناه إن حلمك غالي عليك ونفسك تفرح أهلك وتدخل ${college}. بس اسمعني.. الخوف عمره ما بيحل المشكلة. خد نفس عمييق كدة 🧘، واطرد الأفكار السلبية دي. ركز بس في الـ 25 دقيقة الجاية في بومودورو واحد، وانسى الامتحان والنتيجة تماماً دلوقتي. خطوة بخطوة هتوصل! 💖⚡ (الضغط حالياً مرتفع على خادمي، لكن رفيقك دايماً معاك وبيدعمك!)`;
    } else if (isLazy) {
      reply = `يا بطلنا الغالي ${name}! الكسل ده هو الفخ اللي ممكن يضيع تعب أيام! قوم كدة اغسل وشك بماء بارد 💧، واعمل كوباية شاي أو قهوة. افتكر فرحة والدتك ووالدك يوم النتيجة وبكاء الفرحة الحقيقي.. اللحظة دي تستاهل تدوس على كسلك دلوقتي علشانها! يلا ابدأ بومودورو دراسي سريع وسخن دماغك! 🚀🔥 (خادم الذكاء الاصطناعي مجهد قليلاً لكن حماسك لا ينطفئ!)`;
    } else if (isLost) {
      reply = `اسمعني كويس يا ${name}.. مفيش حاجة اسمها ضعت ومفيش وقت! لسه في إيديك تلم المتراكم عليك. قسم المادة الكبيرة لأجزاء صغيرة جداً، وخدها وحدة وحدة. ركز في المواد الحيوية الخاصة بشعبتك و${branchText}.. لما تشيل المتراكم عن عقلك، النفسية هترتاح. ابدأ بمهمة واحدة بسيطة تخلصها واعلم عليها علامة صح! 🎯📚`;
    } else if (isDream) {
      reply = `يا عيني على الحلم الجميل! دخول ${college} بمجموع عالي هو أحسن حاجة ممكن تهديها لنفسك ولأهلك السنين دي كلها. اللحظة دي بتتصنع من الدقائق وساعات التعب اللي بتعافر فيها دلوقتي يا ${name}. المذاكرة أحياناً بتبقى تقيلة بس نتيجتها حلوة وطعم النجاح ملوش مثيل. كمل سعي بكل قوتك! 🎓✨👑`;
    } else if (isGreeting) {
      reply = `أهلاً بك يا بطل الثانوية! إيه الأخبار معاك ومع المذاكرة النهاردة؟ حاسس بيا وأنا معاك في ضهرك دايماً؟ فضفض لي لو مضغوط، أو اضبط المؤقت وابدأ دير وقتك بامتياز.. أنا جمبك! 🤝🌸`;
    } else {
      reply = `يا بطلنا الغالي ${name} (${studentProfile.title || 'بطل الثانوية'})، رفيقك معاك خطوة بخطوة! بخصوص كلامك الجميل: "${message.substring(0, 45)}..."، حابب أقولك إن الضغط حالياً عالي جداً على سرفر الذكاء الاصطناعي، بس أنا مش هسيبك لوحدك أبداً! فكر دايماً في لحظة النجاح والوصول لـ ${college} بمجموع يرفع الراس (${studentProfile.targetScore || '99'}%). كمل مذاكرة، ركز في بومودورو، واعمل اللي عليك والنتيجة هتبهرك بإذن الله! 🏆💪✨`;
    }

    res.json({ reply });
  }
});

// Endpoint for random motivational notifications
app.get('/api/daily-quote', (req, res) => {
  const motivators = [
    {
      title: "رسالة الصباح الباكر ☀️",
      text: "صباح الخير يا بطل! حلمك بيقرب خطوة جديدة النهارده.. جاهز تكسر الدنيا في المذاكرة؟ كوباية قهوتك ويلا بينا!",
      type: "morning"
    },
    {
      title: "طاقة للتركيز ⏱️",
      text: "حصالة أحلامك بتتملي بكل دقيقة تعب ومذاكرة بتعملها دلوقتي. تعبك مش هيروح هدر أبداً يا وحش!",
      type: "focus"
    },
    {
      title: "صديقك المخلص هنا🤝",
      text: "حاسس بتعب أو إرهاق؟ طبيعي جداً.. خد استراحة قصيرة، افتكر حلمك، وارجع أقوى. أنا هنا مستنيك تكمل بطولتك!",
      type: "support"
    },
    {
      title: "جرعة ثقة 💪",
      text: "مفيش مادة صعبة على بطل زيك! خطة بسيطة، كوب شاي، وتركيز بومودورو واحد وهتقضي عليها تماماً.",
      type: "focus"
    },
    {
      title: "الحلم يناديك 🌟",
      text: "تخيل دقات قلبك وفرحة أهلك يوم النتيجة لما تلاقي اسمك في القمة.. اللحظة دي تستاهل كل نقطة عرق وتعب دلوقتي!",
      type: "support"
    },
    {
      title: "عزيمة لا تلين 🚀",
      text: "أنت لست مجرد طالب عادي، أنت مقاتل حقيقي يصنع مستقبله بيديه. لا تلتفت للوراء، استمر في التقدم والتحصيل!",
      type: "morning"
    },
    {
      title: "شاحن الهمة 💡",
      text: "النجاح يبدأ من استغلال اللحظة الحالية. افتح كتابك بابتسامة، انسَ ما فات، وركز في الصفحة اللي قدامك كأنها معركتك الوحيدة!",
      type: "focus"
    },
    {
      title: "فخور بك جداً ❤️",
      text: "حتى لو حسيت بالتقصير أحياناً، فمجهودك المستمر ومحاولتك تصنع منك بطلاً أقوى كل يوم. استرخي ثم أكمل طريقك بثقة!",
      type: "support"
    },
    {
      title: "وقود العزيمة ⛽",
      text: "النتيجة النهائية مش صدفة، دي انعكاس للجهد المستخبي اللي محدش بيشوفه غير ربنا. عافر عشان تفرح بجد في النهاية!",
      type: "support"
    },
    {
      title: "رسالة بطل الـ 100% 🏅",
      text: "كل قانون مادة بمثابة فرصة لتكون نجم تالتة ثانوي. بكرة المجموع والتقدير يشرفوك قدام الدنيا كلها وطريقك لسه مفتوح يا أسد!",
      type: "focus"
    },
    {
      title: "همسة نجاح 🤫",
      text: "لو حاسس بصعوبة النهاردة، افتكر إن ده طبيعي ومفيش نجاح بيجي مريح. كمل مذاكرة وسيب الباقي على ربنا، هيكرمك كرم يليق بجهدك!",
      type: "support"
    },
    {
      title: "ثقة بالنفس 🌟",
      text: "مفيش حد يقدر يوقف شخص عاقد النية إنه يوصل لهدفه. حلمك مش مستحيل، خطوات صغيرة ومستمرة بتصنع المعجزات!",
      type: "support"
    },
    {
      title: "العمل بصمت 🤫",
      text: "اتعب في الصمت وخلي صوت نجاحك هو اللي يتكلم. مجهودك اللباد والتركيز العالي هيترجم بكرة لأفراح وزغاريد في بيتكوا!",
      type: "focus"
    },
    {
      title: "محارب الأحلام ⚔️",
      text: "المواد مش بعبع، المواد دي شوية خطوات وتركيز. قسم الدرس لمهام صغيرة واقضِ عليها بطل بطل. أنت قدها وزيادة!",
      type: "focus"
    },
    {
      title: "أنا في ضهرك دايماً 🤝",
      text: "لما الدنيا تضلم قدامك وتلاقي المذاكرة تقلت، افتكر إن الرفيق دايماً معاك. خد عشر دقايق راحة، اسمع حاجة مبهجة، وارجع أقوى من الأول بكتير!",
      type: "support"
    },
    {
      title: "بريق الأمل ✨",
      text: "الامتحان مش نهاية العالم، الامتحان ده بوابتك لرحلة جديدة ممتعة جداً في الكلية اللي بتتمناها. تعب شهور هيتنسي في ثانية فرحة واحدة!",
      type: "support"
    },
    {
      title: "صانع المجد 🏆",
      text: "فرحتك والكتب مفتوحة والتركيز في السحاب تساوي كنوز الدنيا. متسمعش لأي كلام سلبي يرجعك لورا، كمل طريقك بثقة ورأس مرفوعة!",
      type: "morning"
    },
    {
      title: "شاطئ التفوق 🏖️",
      text: "يوم النتيجة جاي جاي، وتخيل وأنت بتتصل بأهلك وبتقولهم 'أنا جبت كليتي المفضلة يا جماعة وزغردت البيت كله!'.. شعور يستحق المقاومة!",
      type: "support"
    }
  ];
  const randomIndex = Math.floor(Math.random() * motivators.length);
  res.json(motivators[randomIndex]);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
