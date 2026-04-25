import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Bot, Sparkles, Loader2, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Жұмыс берушіге — AI вакансия парсинг" },
      { name: "description", content: "Жай мәтін жазыңыз — AI оны кәсіби вакансияға айналдырады." },
      { property: "og:title", content: "Жұмыс берушіге — MJB" },
      { property: "og:image", content: "/og-image.svg" },
    ],
  }),
  component: Employer,
});

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-vacancy`;

const EXAMPLES = [
  "14 мкр-дағы кафеге официант керек, айлық 200к, тәжірибе маңызды емес, шұғыл",
  "Срочно нужен бариста в 7 мкр, опыт от 1 года, з/п 250-300к",
  "SMM-щик на удаленку, инстаграм для салона красоты, 200к, нужен опыт с reels",
];

function Employer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [vacancy, setVacancy] = useState<any>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function parse() {
    if (!text.trim()) return;
    setLoading(true); setError(""); setVacancy(null); setSaved(false);
    try {
      const r = await fetch(FN_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Қате"); return; }
      setVacancy(j.vacancy);
    } catch { setError("Желі қатесі"); }
    finally { setLoading(false); }
  }

  async function publish() {
    if (!vacancy) return;
    const { error } = await supabase.from("vacancies").insert({ ...vacancy, raw_text: text });
    if (error) { setError(error.message); return; }
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Bot className="h-3 w-3" /> Жұмыс берушіге
          </span>
          <h1 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Жай жазыңыз — AI <span className="text-primary">вакансияны</span> жасайды
          </h1>
          <p className="text-muted-foreground mt-3">
            Қиын формаларды толтырудың қажеті жоқ. Telegram ботқа жазғандай еркін жазыңыз.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card-gradient p-6 md:p-8 shadow-elegant">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Мысалы: «14 мкр-дағы кафеге официант керек, айлық 200к...»"
            className="w-full rounded-xl border border-input bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((e, i) => (
              <button
                key={i}
                onClick={() => setText(e)}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-accent"
              >
                💡 Үлгі {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={parse}
            disabled={loading || !text.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-hero-gradient px-6 py-3 font-bold text-primary-foreground shadow-elegant disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            AI-мен өңдеу
          </button>
          {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
        </div>

        {vacancy && (
          <div className="mt-6 rounded-3xl border-2 border-primary/30 bg-card-gradient p-8 shadow-elegant">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-success">✓ AI өңдеді</div>
                <h2 className="font-display text-2xl font-bold mt-1">{vacancy.title}</h2>
                <p className="text-muted-foreground">{vacancy.company} · {vacancy.district}</p>
              </div>
              {vacancy.is_urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
                  <Zap className="h-3 w-3" /> ШҰҒЫЛ
                </span>
              )}
            </div>

            {(vacancy.salary_min || vacancy.salary_max) && (
              <div className="font-display text-xl font-bold text-success mb-3">
                {vacancy.salary_min && new Intl.NumberFormat("ru-RU").format(vacancy.salary_min)}
                {vacancy.salary_min && vacancy.salary_max && " – "}
                {vacancy.salary_max && new Intl.NumberFormat("ru-RU").format(vacancy.salary_max)} ₸
              </div>
            )}

            <p className="text-foreground/90">{vacancy.description}</p>

            {vacancy.requirements?.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Талаптар</div>
                <ul className="space-y-1">
                  {vacancy.requirements.map((r: string, i: number) => (
                    <li key={i} className="text-sm flex gap-2"><span className="text-primary">•</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {vacancy.skills?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {vacancy.skills.map((s: string) => (
                  <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{s}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-2 flex-wrap">
              <button
                onClick={publish}
                disabled={saved}
                className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 font-bold text-gold-foreground shadow-glow disabled:opacity-60"
              >
                {saved ? <><CheckCircle2 className="h-4 w-4" /> Жарияланды!</> : "Сайтқа жариялау"}
              </button>
              <button
                onClick={() => { setVacancy(null); setText(""); setSaved(false); }}
                className="rounded-xl border border-border px-6 py-3 font-semibold"
              >
                Қайта жазу
              </button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
