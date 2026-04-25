import { Link } from "@tanstack/react-router";
import { MapPin, Banknote, Zap } from "lucide-react";

export type Vacancy = {
  id: string;
  title: string;
  company: string;
  district: string;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[] | null;
  is_urgent: boolean | null;
  employment_type: string | null;
};

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export function VacancyCard({ v, matchScore }: { v: Vacancy; matchScore?: number }) {
  return (
    <Link
      to="/jobs"
      className="group block rounded-2xl border border-border bg-card-gradient p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {v.title}
            </h3>
            {v.is_urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive animate-pulse-ring">
                <Zap className="h-3 w-3" /> ШҰҒЫЛ
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{v.company}</p>
        </div>
        {typeof matchScore === "number" && (
          <div className="shrink-0 text-center">
            <div className="font-display text-xl font-bold text-primary">{matchScore}%</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">сәйкестік</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" /> {v.district}
        </span>
        {(v.salary_min || v.salary_max) && (
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Banknote className="h-4 w-4 text-success" />
            {v.salary_min ? fmt(v.salary_min) : ""}
            {v.salary_min && v.salary_max ? " – " : ""}
            {v.salary_max ? fmt(v.salary_max) : ""} ₸
          </span>
        )}
      </div>

      {v.skills && v.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {v.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
