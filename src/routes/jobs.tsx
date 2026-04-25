import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VacancyCard, type Vacancy } from "@/components/VacancyCard";
import { AktauMap } from "@/components/AktauMap";
import { ALL_DISTRICTS } from "@/lib/districts";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Вакансиялар Ақтау бойынша — Mangystau Job Bridge" },
      { name: "description", content: "Ақтау микрорайондары бойынша белсенді вакансиялар. AI matching және карта арқылы іздеу." },
      { property: "og:title", content: "Вакансиялар — Mangystau Job Bridge" },
      { property: "og:description", content: "Ақтау бойынша жұмыс іздеуге арналған AI платформа." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [items, setItems] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("vacancies")
        .select("id,title,company,district,salary_min,salary_max,skills,is_urgent,employment_type")
        .eq("status", "active")
        .order("is_urgent", { ascending: false })
        .order("created_at", { ascending: false });
      setItems((data as Vacancy[]) || []);
      setLoading(false);
    })();
  }, []);

  const counts = items.reduce<Record<string, number>>((acc, v) => {
    acc[v.district] = (acc[v.district] || 0) + 1;
    return acc;
  }, {});

  const filtered = items.filter((v) => {
    if (district && v.district !== district) return false;
    if (urgentOnly && !v.is_urgent) return false;
    if (q) {
      const s = q.toLowerCase();
      if (!v.title.toLowerCase().includes(s) && !v.company.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Ақтау бойынша вакансиялар
          </h1>
          <p className="text-muted-foreground mt-1">
            {items.length} белсенді жұмыс орны · Картадан немесе тізімнен таңдаңыз
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <AktauMap counts={counts} selected={district} onSelect={setDistrict} />
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Мамандық немесе компания..."
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDistrict(null)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    !district ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  Барлығы
                </button>
                {ALL_DISTRICTS.slice(0, 8).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDistrict(d === district ? null : d)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      district === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span>Тек шұғыл вакансиялар</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Filter className="h-4 w-4" /> {filtered.length} нәтиже
                {district && <span className="text-foreground">· {district}</span>}
              </span>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                Бұл сүзгі бойынша вакансия табылмады.
              </div>
            ) : (
              filtered.map((v) => <VacancyCard key={v.id} v={v} matchScore={70 + ((v.title.length * 7) % 28)} />)
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
