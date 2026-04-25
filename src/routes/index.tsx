import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VacancyCard, type Vacancy } from "@/components/VacancyCard";
import heroImg from "@/assets/hero-aktau.jpg";
import {
  Mic, Map, MessageSquare, Sparkles, Zap, Award,
  Briefcase, ArrowRight, Bot, GraduationCap, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mangystau Job Bridge — AI жұмыс іздеу платформасы Ақтау" },
      { name: "description", content: "Маңғыстау жастары мен бизнесін AI арқылы байланыстыратын цифрлық экожүйе. Голосовое → резюме, карта, mock интервью." },
      { property: "og:title", content: "Mangystau Job Bridge" },
      { property: "og:description", content: "Ақтау бойынша AI-көмегімен жұмыс табыңыз — карта, голосовое резюме, mock интервью." },
      { property: "og:image", content: "/og-cover.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  const [latest, setLatest] = useState<Vacancy[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("vacancies")
        .select("id,title,company,district,salary_min,salary_max,skills,is_urgent,employment_type")
        .eq("status", "active")
        .order("is_urgent", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(4);
      setLatest((data as Vacancy[]) || []);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Ақтау Каспий теңізі" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-hero-gradient opacity-85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 backdrop-blur px-3 py-1 text-xs font-semibold text-gold border border-gold/30">
              <Sparkles className="h-3 w-3" /> AI · Ақтау · 2026
            </span>
            <h1 className="font-display mt-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-primary-foreground text-balance">
              Маңғыстау жастары үшін <span className="text-gold">AI-көпір</span> жұмысқа
            </h1>
            <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
              WhatsApp чаттарындағы шашыраңқы вакансиялар енді бір жерде. Голосовое жазыңыз — AI сізге PDF резюме жасайды, картадан жұмыс табыңыз, mock интервьюге дайындалыңыз.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold text-gold-foreground shadow-glow hover:scale-[1.02] transition-transform"
              >
                <Briefcase className="h-4 w-4" /> Жұмыс іздеу
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/voice-resume"
                className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-white/15 transition"
              >
                <Mic className="h-4 w-4" /> Голосовое → AI резюме
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
              <Stat n="13" label="Микрорайон" />
              <Stat n="AI" label="Matching score" />
              <Stat n="0₸" label="Жастарға тегін" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Мәселе</span>
            <h2 className="font-display mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Ақтаудың жұмыс нарығы — ескі WhatsApp чаттарда қалып қойды
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                "Жұмыс орындары 50+ Telegram/WhatsApp чаттарға шашыраған",
                "Шағын бизнес «hh.kz»-қа тіркелуді қиын деп санайды",
                "Жастар өз ауданындағы мүмкіндіктерді көрмейді",
                "Дипломы жоқ жастардың дағдыларын растайтын құрал жоқ",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gold-gradient p-8 shadow-elegant">
            <div className="text-gold-foreground/80 text-sm font-semibold">NEET статистика</div>
            <div className="font-display text-6xl font-bold text-gold-foreground mt-2">~22%</div>
            <p className="text-gold-foreground/90 mt-2">
              Қазақстан жастарының бір бөлігі — оқымайтын, жұмыс істемейтін NEET категориясында. Маңғыстау оларға бірінші мүмкіндік береді.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Шешім</span>
            <h2 className="font-display mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              AI-көмегімен жұмыс табудың жаңа жолы
            </h2>
            <p className="text-muted-foreground mt-3">
              Бір экожүйе — жұмыс берушіге Telegram бот, жастарға — премиум сайт.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={Map}
              title="Интерактивті карта"
              text="Ақтаудың 13 микрорайоны бойынша вакансияларды визуалды табыңыз."
              to="/map"
              accent
            />
            <Feature
              icon={Mic}
              title="Голосовое → AI резюме"
              text="Боттан немесе сайттан 30 секунд айтып бер — AI сапалы PDF резюме жасайды."
              to="/voice-resume"
            />
            <Feature
              icon={MessageSquare}
              title="AI Mock Interview"
              text="Виртуалды HR-мен жаттығып, кеңес алыңыз. Стрестен арылыңыз."
              to="/interview"
            />
            <Feature
              icon={Bot}
              title="AI вакансия парсинг"
              text="Жұмыс беруші ботқа жай мәтін жазады — AI оны структуралы вакансияға айналдырады."
              to="/employer"
            />
            <Feature
              icon={GraduationCap}
              title="Тегін микро-курстар"
              text="Официант, бариста, админ дағдылары — 1 күнде. Сертификатпен."
              to="/courses"
            />
            <Feature
              icon={ShieldCheck}
              title="Trust Score"
              text="Курс + растаулар = жоғары рейтинг. Жұмыс берушілер «Алтын кандидатты» бірден көреді."
              to="/courses"
            />
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Бүгінгі</span>
            <h2 className="font-display mt-2 text-3xl md:text-4xl font-bold">Жаңа вакансиялар</h2>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            Барлығы <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {latest.map((v) => <VacancyCard key={v.id} v={v} />)}
        </div>
      </section>

      {/* FLOW */}
      <section className="bg-foreground text-background py-16 md:py-24 rounded-t-[3rem]">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center max-w-xl mx-auto">
            Қалай жұмыс істейді
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-5">
            {[
              ["1", "Жұмыс беруші ботқа жазады"],
              ["2", "AI вакансияны структуралы етеді"],
              ["3", "Жас сайтта голосовоемен резюме жасайды"],
              ["4", "AI matching: 95% сәйкестік"],
              ["5", "Жұмыс беруші бірден push алады"],
            ].map(([n, t]) => (
              <div key={n} className="relative">
                <div className="font-display text-5xl font-bold text-gold">{n}</div>
                <p className="mt-2 text-sm text-background/80">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-3xl bg-hero-gradient p-10 md:p-14 text-center shadow-elegant">
          <Zap className="mx-auto h-10 w-10 text-gold" />
          <h2 className="font-display mt-3 text-3xl md:text-4xl font-bold text-primary-foreground">
            Алғашқы жұмысыңды бүгін тап
          </h2>
          <p className="text-primary-foreground/85 mt-3 max-w-xl mx-auto">
            Ақтаудан Қазақстанға — біз жастардың әлеуетін AI арқылы ашамыз.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/jobs" className="rounded-xl bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-glow">
              Вакансияларға өту
            </Link>
            <Link to="/voice-resume" className="rounded-xl glass px-6 py-3 font-bold text-primary-foreground">
              AI резюме жасау
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl font-bold text-gold">{n}</div>
      <div className="text-xs md:text-sm text-primary-foreground/75 mt-1">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon, title, text, to, accent,
}: { icon: typeof Award; title: string; text: string; to: string; accent?: boolean }) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border border-border p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all ${
        accent ? "bg-hero-gradient text-primary-foreground" : "bg-card-gradient"
      }`}
    >
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
        accent ? "bg-gold text-gold-foreground" : "bg-primary/10 text-primary"
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display mt-4 text-lg font-bold">{title}</h3>
      <p className={`mt-1 text-sm ${accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
        {text}
      </p>
      <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${
        accent ? "text-gold" : "text-primary"
      } group-hover:gap-2 transition-all`}>
        Көру <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
