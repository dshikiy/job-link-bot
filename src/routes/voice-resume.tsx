import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mic, Square, Loader2, Sparkles, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/voice-resume")({
  head: () => ({
    meta: [
      { title: "Голосовое → AI резюме — Mangystau Job Bridge" },
      { name: "description", content: "30 секунд айтыңыз, AI сізге кәсіби резюме жасайды. Ақтаулық жастарға тегін." },
      { property: "og:title", content: "AI Голосовое резюме — MJB" },
      { property: "og:image", content: "/og-image.svg" },
    ],
  }),
  component: VoiceResume,
});

type Resume = {
  full_name: string;
  age?: number;
  district?: string;
  summary: string;
  experience: { role: string; company?: string; period?: string; details?: string }[];
  skills: string[];
  languages: string[];
  desired_role?: string;
};

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-resume`;

function VoiceResume() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  async function start() {
    setError(""); setResume(null); setTranscript(""); setSeconds(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await process(new Blob(chunksRef.current, { type: "audio/webm" }));
      };
      mr.start();
      recRef.current = mr;
      setRecording(true);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Микрофонға рұқсат бере алмадық");
    }
  }

  function stop() {
    recRef.current?.stop();
    setRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  async function process(blob: Blob) {
    setLoading(true);
    try {
      const buf = await blob.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio_base64: b64, mime_type: "audio/webm" }),
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Қате орын алды"); return; }
      setTranscript(j.transcript || "");
      setResume(j.resume || null);
    } catch (e) {
      setError("Желі қатесі");
    } finally {
      setLoading(false);
    }
  }

  async function processText(text: string) {
    setLoading(true); setResume(null); setError(""); setTranscript(text);
    try {
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Қате"); return; }
      setResume(j.resume || null);
    } finally { setLoading(false); }
  }

  function downloadJson() {
    if (!resume) return;
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `resume-${resume.full_name || "candidate"}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-foreground">
            <Sparkles className="h-3 w-3" /> AI · Whisper + LLM
          </span>
          <h1 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Айтыңыз — AI сізге <span className="text-primary">резюме</span> жасайды
          </h1>
          <p className="text-muted-foreground mt-3">
            «Сәлем, мен Азаматпын, 20 жастамын, жарты жыл құрылыста жұмыс істедім, қабырға бояй аламын» — осындай тіркестен AI кәсіби резюме шығарады.
          </p>
        </div>

        {/* Recorder */}
        <div className="mt-10 rounded-3xl border border-border bg-card-gradient p-8 md:p-12 text-center shadow-elegant">
          <div className="relative inline-flex">
            <button
              onClick={recording ? stop : start}
              disabled={loading}
              className={`relative h-28 w-28 rounded-full font-bold text-primary-foreground transition-all ${
                recording ? "bg-destructive animate-pulse-ring" : "bg-hero-gradient hover:scale-105 shadow-glow"
              } disabled:opacity-50`}
            >
              {recording ? <Square className="h-10 w-10 mx-auto" /> : <Mic className="h-10 w-10 mx-auto" />}
            </button>
          </div>
          <div className="mt-4 font-display text-2xl font-bold">
            {recording ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}` : loading ? "AI өңдеуде..." : "Жазуды бастау"}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {recording ? "Сөйлеп болғанда тоқтату батырмасын басыңыз" : "30-60 секунд жеткілікті"}
          </p>
          {loading && <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-primary" />}
          {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
        </div>

        {/* Manual fallback */}
        <details className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
          <summary className="cursor-pointer font-semibold">Микрофон жоқ па? Мәтінмен жазыңыз</summary>
          <textarea
            id="manual"
            rows={4}
            className="mt-3 w-full rounded-lg border border-input bg-background p-3"
            placeholder="Сәлем, мен... жастамын, ... жұмыс істедім, ... білемін"
          />
          <button
            onClick={() => {
              const v = (document.getElementById("manual") as HTMLTextAreaElement)?.value;
              if (v) processText(v);
            }}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            AI резюме жасау
          </button>
        </details>

        {transcript && (
          <div className="mt-6 rounded-2xl bg-muted p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Транскрипт</div>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {resume && (
          <div className="mt-6 rounded-3xl border border-primary/20 bg-card-gradient p-8 shadow-elegant">
            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-bold">{resume.full_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {[resume.age && `${resume.age} жас`, resume.district].filter(Boolean).join(" · ")}
                </p>
                {resume.desired_role && (
                  <div className="mt-1 inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold-foreground">
                    🎯 {resume.desired_role}
                  </div>
                )}
              </div>
              <button onClick={downloadJson} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                <Download className="h-4 w-4" /> JSON
              </button>
            </div>

            <Section title="Қысқаша">
              <p className="text-foreground/90">{resume.summary}</p>
            </Section>

            {resume.experience.length > 0 && (
              <Section title="Тәжірибе">
                <ul className="space-y-2">
                  {resume.experience.map((e, i) => (
                    <li key={i} className="rounded-lg bg-muted p-3">
                      <div className="font-semibold">{e.role}{e.company && <span className="text-muted-foreground"> — {e.company}</span>}</div>
                      {e.period && <div className="text-xs text-muted-foreground">{e.period}</div>}
                      {e.details && <div className="text-sm mt-1">{e.details}</div>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Дағдылар">
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{s}</span>
                ))}
              </div>
            </Section>

            {resume.languages.length > 0 && (
              <Section title="Тілдер">
                <div className="flex flex-wrap gap-1.5">
                  {resume.languages.map((l) => (
                    <span key={l} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{l}</span>
                  ))}
                </div>
              </Section>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-success">
              <FileText className="h-4 w-4" />
              Резюме сіздің профиліңізге сақтауға дайын
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
}
