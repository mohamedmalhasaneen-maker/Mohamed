import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.post('/api/vent', async (req, res) => {
  try {
    const { message, previousMessages = [], studentProfile = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'الرجاء إدخال رسالة مفعمة بالمشاعر.' });
    }

    const { branch, dreamCollege, targetScore, studyTime } = studentProfile;
    
    let contextPrompt = "";
    if (branch || dreamCollege || targetScore || studyTime) {
      const arabicBranch = branch === 'science' ? 'علمي علوم' : branch === 'math' ? 'علمي رياضة' : branch === 'literature' ? 'أدبي' : branch;
      const arabicTime = studyTime === 'morning' ? 'الصباح' : studyTime === 'evening' ? 'المساء' : studyTime;
      contextPrompt = `\n[بيانات الطالب الحالية كمرجع لك: الشعبة: ${arabicBranch || 'غير محددة'}، الكلية المستهدفة: ${dreamCollege || 'غير محددة'}، المجموع المستهدف: ${targetScore || 'غير محدد'}٪، أفضل وقت للمذاكرة والنشاط: ${arabicTime || 'غير محدد'}].\n`;
    }

    // Build contents array
    const contents: any[] = [];
    
    previousMessages.forEach((msg: any) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: message + (contextPrompt ? contextPrompt : '') }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `أنت "رفيق الثانوية" (بطل المذاكرة)، مرشد نفسي ودراسي مبدع وشديد التعاطف لطلاب الثانوية العامة (أو البكالوريا) في مصر والعالم العربي.
يتحدث الطالب إليك عن مشاعره، الضغوطات، خوفه من الامتحانات، أو شعوره بالتقصير والضياع والتكاسل والإحباط.
يجب عليك الرد بذكاء وعاطفة حقيقية باللغة العربية التفاعلية البسيطة الممزوجة بلهجة مصرية ودودة جداً ودافئة (سحر الصديق القريب الحكيم، والمدرب الحماسي السند).
القواعد التي يجب أن تلتزم بها في ردك:
1. طمئن الطالب تماماً وأخرج منه طاقة التوتر والخوف ("خد نفس عميق يا بطل"، "كلنا بنمر باللحظة دي والمشاعر دي طبيعية"، "مفيش حاجة تضيع مجهودك").
2. أظهر تفهّماً عميقاً لشعوره بالضغط والتوتر ولا تقلل منه أبداً.
3. حفزه بحلمه والكلية التي يتمناها (مثلاً إذا كان يريد كلية الطب أو الهندسة أو غيرها، اربطها بردك بذكاء ليكون الوقود لقلبه).
4. لا تسرد قوائم طويلة مملة وجافة من النصائح الأكاديمية الصارمة. بدلاً من ذلك، أعطه نصيحة أو نصيحتين بأسلوب رقيق وعملي يسهل تطبيقه مباشرة (مثل أخذ استراحة 5 دقائق، التركيز على نصف صفحة فقط الآن، تنظيم مكتبه، شرب كوب ماء دافئ، أو ممارسة تمرين التنفس بومودورو).
5. احرص على أن تكون الردود متوسطة الطول ومريحة تماماً للقراءة وليست جدراناً طويلة من النصوص الكثيفة والفقرات العملاقة. استخدم مسافات مريحة وتنسيق نقاط، وكلمات مشحونة بالحماس والمحبة والطاقة الإيجابية.
6. لا تذكر تفاصيل برمجية أو ذكاء اصطناعي، وتحدث بصوت "رفيق دراسته الصادق".`,
        temperature: 0.85,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.' });
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
      type: "morning"
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
