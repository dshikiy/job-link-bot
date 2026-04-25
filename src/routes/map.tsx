import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AktauMap } from "@/components/AktauMap";
import { VacancyCard, type Vacancy } from "@/components/VacancyCard";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Ақтау вакансия картасы — Mangystau Job Bridge" },
      { name: "description", content: "Ақтаудың барлық микрорайондары бойынша вакансиялардың интерактивті картасы." },
      { property: "og:title", content: "Интерактивті карта — Mangystau Job Bridge" },
      { property: "og:description", content: "Микрорайон бойынша жұмыс орындарын картадан көріңіз." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [items, setItems] = useState<Vacancy[]>([]);
  const [district, setDistrict] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("vacancies")
        .select("id,title,company,district,salary_min,salary_max,skills,is_urgent,employment_type")
        .eq("status", "active");
      setItems((data as Vacancy[]) || []);
    })();
  }, []);

  const counts = items.reduce<Record<string, number>>((acc, v) => {
    acc[v.district] = (acc[v.district] || 0) + 1;
    return acc;
  }, {});

  const visible = district ? items.filter((v) => v.district === district) : items;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Ақтаудың интерактивті картасы
        </h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Микрорайонды басып, жақын маңдағы вакансияларды көріңіз
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <AktauMap counts={counts} selected={district} onSelect={setDistrict} />
          <div className="space-y-3">
            <div className="rounded-2xl bg-hero-gradient p-5 text-primary-foreground shadow-elegant">
              <div className="text-sm opacity-80">
                {district ? "Таңдалған аудан" : "Барлық микрорайондар"}
              </div>
              <div className="font-display text-3xl font-bold mt-1">
                {district || "Ақтау"}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {visible.length} белсенді вакансия
              </div>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {visible.length === 0 ? (
                <p className="text-muted-foreground text-sm p-4">Вакансиялар жүктелуде немесе табылмады.</p>
              ) : (
                visible.slice(0, 10).map((v) => <VacancyCard key={v.id} v={v} />)
              )}
            </div>
            <Link
              to="/jobs"
              className="block text-center rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Барлық вакансияларды көру →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
