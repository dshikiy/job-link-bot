export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-24 pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient">
              <span className="font-display text-xs font-bold text-primary-foreground">MJB</span>
            </div>
            <span className="font-display font-bold">Mangystau Job Bridge</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Маңғыстау жастарын жұмыспен қамтудың AI-көпірі. Ақтаудан Қазақстанға.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Платформа</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Вакансиялар</li>
            <li>Карта бойынша іздеу</li>
            <li>AI резюме генератор</li>
            <li>Тегін курстар</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Байланыс</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Ақтау, Маңғыстау обл.</li>
            <li>hello@mjb.kz</li>
            <li>Hackathon MVP · 2026</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 Mangystau Job Bridge. NEET жастарына — мүмкіндік.
      </div>
    </footer>
  );
}
