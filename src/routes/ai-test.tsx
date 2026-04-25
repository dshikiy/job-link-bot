import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Brain, Sparkles, Loader2, ArrowRight, Check, Users, Clock, Zap, Target, ChevronRight, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/ai-test")({
  head: () => ({
    meta: [
      { title: "AI Тест — Қай мамандық сізге қолайлы? — Mangystau Job Bridge" },
      { name: "description", content: "AI тест арқылы өзіңізге қолайлы мамандықты анықтаңыз. Жылдам, тегін, нәтижелі." },
      { property: "og:title", content: "AI Тест — MJB" },
      { property: "og:image", content: "/og-image.svg" },
    ],
  }),
  component: AiTest,
});

const QUESTIONS = [
  {
    id: 1,
    question: "Жұмыс кезінде қандай ортаны қалайсыз?",
    options: [
      { label: "Көп адамдармен қарым-қатынас", icon: Users, value: "social" },
      { label: "Жеке жұмыс, тыныш орта", icon: Brain, value: "independent" },
      { label: "Командамен бірге", icon: Users, value: "team" },
      { label: "Клиенттермен тікелей", icon: Users, value: "client" },
    ],
  },
  {
    id: 2,
    question: "Жұмыс қарқыны қандай болуы керек?",
    options: [
      { label: "Тез, белсенді", icon: Zap, value: "fast" },
      { label: "Орташа, теңгерімді", icon: Clock, value: "moderate" },
      { label: "Бірқалыпты, күтілген", icon: Clock, value: "steady" },
      { label: "Еркін, өзімше", icon: Brain, value: "flexible" },
    ],
  },
  {
    id: 3,
    question: "Қандай жұмыс түрі сізге қызықты?",
    options: [
      { label: "Адамдармен көмектесу", icon: Users, value: "helping" },
      { label: "Техникамен жұмыс", icon: Brain, value: "technical" },
      { label: "Шығармашылық", icon: Sparkles, value: "creative" },
      { label: "Сандармен жұмыс", icon: Target, value: "analytical" },
    ],
  },
  {
    id: 4,
    question: "Оқу немесе практика қалайша жақсырақ?",
    options: [
      { label: "Практика арқылы", icon: Zap, value: "hands_on" },
      { label: "Теория арқылы", icon: Brain, value: "theoretical" },
      { label: "Видео сабақтар", icon: Sparkles, value: "visual" },
      { label: "Жаттығу арқылы", icon: Target, value: "practice" },
    ],
  },
  {
    id: 5,
    question: "Қандай жалақы моделі қызықты?",
    options: [
      { label: "Тұрақты кіріс", icon: Target, value: "fixed" },
      { label: "Сыйақы + бонус", icon: Zap, value: "bonus" },
      { label: "Сағат бойынша", icon: Clock, value: "hourly" },
      { label: "Нәтижеге байланысты", icon: Target, value: "performance" },
    ],
  },
];

const CAREER_RECOMMENDATIONS = [
  { title: "Официант", score: 92, desc: "Адамдармен қарым-қатынас, белсенді жұмыс", skills: ["Коммуникабельдік", "Көпшілікте жұмыс", "Жылдамдық"], color: "from-blue-500 to-cyan-500" },
  { title: "Бариста", score: 88, desc: "Шығармашылық + техника, тыныш орта", skills: ["Кофені білу", "Қолжеткізушілік", "Тазалық"], color: "from-amber-500 to-orange-500" },
  { title: "Сатушы-консультант", score: 85, desc: "Клиенттермен жұмыс, сату дағдылары", skills: ["Сенімділік", "Сатушылық", "Өнім білу"], color: "from-emerald-500 to-teal-500" },
  { title: "SMM маман", score: 82, desc: "Шығармашылық, удалёнды жұмыс", skills: ["Контент жасау", "Дизайн", "Маркетинг"], color: "from-pink-500 to-rose-500" },
  { title: "Админ", score: 78, desc: "Кеңсе жұмысы, тыныш орта", skills: ["Ұйымдастыру", "Документация", "Коммуникация"], color: "from-violet-500 to-purple-500" },
  { title: "Курьер", score: 75, desc: "Еркін график, белсенділік", skills: ["Уақытты басқару", "Навигация", "Жауапкершілік"], color: "from-green-500 to-emerald-500" },
];

function AiTest() {
  const [step, setStep] = useState<"intro" | "questions" | "loading" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  function selectAnswer(qId: number, value: string) {
    setAnswers({ ...answers, [qId]: value });
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setStep("loading");
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("results");
      }, 2500);
    }
  }

  function restart() {
    setStep("intro");
    setCurrentQ(0);
    setAnswers({});
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-hero-gradient shadow-elegant">
              <Brain className="h-10 w-10 text-primary-foreground" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-bold text-gold-foreground">
              <Sparkles className="h-4 w-4" /> AI Тест
            </span>
            <h1 className="font-display mt-4 text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Сізге қай мамандық <span className="text-primary">қолайлы?</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              5 жылдам сұрақ арқылы AI сізге ең қолайлы жұмыс түрлерін анықтайды. 
              Нәтижесі бойынша курстар мен вакансиялар ұсынады.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => { setStep("questions"); setCurrentQ(0); }}
                className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-4 text-lg font-bold text-gold-foreground shadow-glow hover:scale-[1.02] transition-transform"
              >
                Тестті бастау <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-sm text-muted-foreground">⏱️ 2 минут • Тегін • Нетто</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Zap, label: "Жылдам нәтиже" },
                { icon: Target, label: "Дұрыс бағыт" },
                { icon: Sparkles, label: "AI анализ" },
              ].map((f, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <f.icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-medium">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="relative mb-8">
            <div className="h-24 w-24 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 animate-pulse rounded-full border-4 border-transparent border-t-primary" />
            <Brain className="absolute inset-0 m-auto h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold">AI анализ жасауда...</h2>
          <p className="mt-2 text-muted-foreground">Сіздің жауаптарыңызды талдауда</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-1.5 text-sm font-bold text-success-foreground">
              <Check className="h-4 w-4" /> Тест аяқталды
            </span>
            <h1 className="font-display mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Сізге қолайлы мамандықтар
            </h1>
            <p className="mt-2 text-muted-foreground">AI анализ бойынша ең сәйкес келетін жұмыстар</p>
          </div>

          <div className="mt-8 grid gap-4">
            {CAREER_RECOMMENDATIONS.map((c, i) => (
              <div
                key={c.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-elegant hover:-translate-y-1 ${
                  i === 0 ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${c.color}`} />
                <div className="relative flex items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color}`}>
                    <span className="font-display text-2xl font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-xl font-bold">{c.title}</h3>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {c.score}% сәйкес
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.skills.map((s) => (
                        <span key={s} className="rounded-full bg-muted px-2 py-1 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-glow"
            >
              Вакансияларды көру <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-bold"
            >
              Курстарды бастау
            </a>
          </div>

          <button
            onClick={restart}
            className="mt-8 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" /> Қайта тестлеу
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Questions step
  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Сұрақ {currentQ + 1} / {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">{q.question}</h2>
          
          <div className="mt-6 grid gap-3">
            {q.options.map((opt) => {
              const Icon = opt.icon;
              const selected = answers[q.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(q.id, opt.value)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            ← Артқа
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}