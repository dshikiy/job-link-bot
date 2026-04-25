import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, Map, Mic, MessageSquare, GraduationCap, Sparkles, Brain } from "lucide-react";

const links = [
  { to: "/", label: "Басты", icon: Sparkles },
  { to: "/ai-test", label: "AI Тест", icon: Brain },
  { to: "/jobs", label: "Вакансиялар", icon: Briefcase },
  { to: "/map", label: "Карта", icon: Map },
  { to: "/voice-resume", label: "AI резюме", icon: Mic },
  { to: "/interview", label: "Mock интервью", icon: MessageSquare },
  { to: "/courses", label: "Курстар", icon: GraduationCap },
] as const;

export function SiteHeader() {
  const { location } = useRouterState();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient shadow-elegant">
            <span className="font-display text-sm font-bold text-primary-foreground">MJB</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-sm font-bold leading-none text-foreground">Mangystau</div>
            <div className="text-[11px] text-muted-foreground leading-tight">Job Bridge</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/employer"
          className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-gold-foreground shadow-card hover:shadow-glow transition-shadow"
        >
          Жұмыс беруші
        </Link>
      </div>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-7 border-t border-border bg-card">
        {links.slice(0, 7).map((l) => {
          const Icon = l.icon;
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center gap-0.5 py-2 text-[9px] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
