import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GraduationCap, Clock, Award, Trophy, ShieldCheck, Star, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Тегін микро-курстар — Mangystau Job Bridge" },
      { name: "description", content: "Официант, бариста, админ дағдылары — 1 күнде, тегін, сертификатпен." },
      { property: "og:title", content: "Тегін курстар — MJB" },
      { property: "og:image", content: "/og-image.svg" },
    ],
  }),
  component: Courses,
});

const COURSES = [
  { title: "Официанттың алғашқы күні", duration: "45 мин", level: "Бастапқы", points: 30, lessons: 6, color: "from-blue-500 to-cyan-500" },
  { title: "Бариста: эспрессо + латте арт", duration: "1.5 сағ", level: "Бастапқы", points: 50, lessons: 10, color: "from-amber-500 to-orange-500" },
  { title: "Сатушы-консультант базасы", duration: "1 сағ", level: "Бастапқы", points: 35, lessons: 7, color: "from-emerald-500 to-teal-500" },
  { title: "SMM Reels: 0-ден монтажға", duration: "2 сағ", level: "Орташа", points: 70, lessons: 12, color: "from-pink-500 to-rose-500" },
  { title: "Әкімшінің этикеті", duration: "40 мин", level: "Бастапқы", points: 30, lessons: 5, color: "from-violet-500 to-purple-500" },
  { title: "Excel негіздері (1С үшін)", duration: "1.5 сағ", level: "Орташа", points: 60, lessons: 9, color: "from-indigo-500 to-blue-500" },
];

function Courses() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-foreground">
            <GraduationCap className="h-3 w-3" /> Тегін · Сертификатпен
          </span>
          <h1 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Дипломсыз жұмысқа <span className="text-primary">дайындалу</span>
          </h1>
          <p className="text-muted-foreground mt-3">
            Бір күнде дағды, профильде сертификат, жұмыс берушіге — Trust Score.
          </p>
        </div>

        {/* Trust Score banner */}
        <div className="mt-8 rounded-3xl bg-hero-gradient p-6 md:p-8 text-primary-foreground shadow-elegant">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold border border-gold/30">
                <Trophy className="h-3 w-3" /> Геймификация
              </div>
              <h2 className="font-display mt-2 text-2xl md:text-3xl font-bold">Trust Score жүйесі</h2>
              <p className="opacity-90 mt-2 max-w-lg">
                Әр өткен курс және расталған пікір сізге ұпай береді. Жоғары рейтингтегі үміткерлер «🌟 Алтын кандидат» белгісін алады және жұмыс берушінің тізімінде жоғары шығады.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 max-w-md">
                <Tier label="Жаңа" min="0–49" />
                <Tier label="🥈 Күміс" min="50–149" highlight />
                <Tier label="🥇 Алтын" min="150+" highlight />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Сіздің рейтинг</span>
                <ShieldCheck className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-5xl font-bold mt-2">75</div>
              <div className="mt-2 h-2 rounded-full bg-white/20">
                <div className="h-full w-1/2 rounded-full bg-gold-gradient" />
              </div>
              <div className="text-xs opacity-80 mt-2">🥈 Күміс деңгей · «Алтынға» 75 ұпай қалды</div>
            </div>
          </div>
        </div>

        {/* Courses grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c, i) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className={`h-32 bg-gradient-to-br ${c.color} relative flex items-end p-4`}>
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white">
                  +{c.points} TS
                </div>
                <GraduationCap className="absolute top-3 left-3 h-6 w-6 text-white/80" />
                <span className="text-white/90 text-xs font-semibold">Курс №{i + 1}</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold leading-tight">{c.title}</h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" /> {c.level}</span>
                  <span>{c.lessons} сабақ</span>
                </div>
                <button className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-glow transition-colors">
                  Бастау
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Why */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Award, title: "Цифрлық сертификат", text: "Профиліңізде жұмыс берушіге көрінетін белгі." },
            { icon: Trophy, title: "Алтын кандидат", text: "Жоғары рейтинг — жоғары орын. Алдымен сізді көреді." },
            { icon: CheckCircle2, title: "Енбек.kz үйлесімді", text: "Дағдыларыңыз мемлекеттік стандартқа сай таңбаланады." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card-gradient p-6">
              <b.icon className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-3 text-lg font-bold">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{b.text}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Tier({ label, min, highlight }: { label: string; min: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border ${highlight ? "border-gold/40 bg-gold/10" : "border-white/20 bg-white/5"} p-2 text-center`}>
      <div className="text-xs font-bold">{label}</div>
      <div className="text-[10px] opacity-75">{min}</div>
    </div>
  );
}
