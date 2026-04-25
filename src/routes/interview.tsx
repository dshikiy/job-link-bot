import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview — HR-мен жаттығу" },
      { name: "description", content: "Виртуалды HR-мен жаттығып, нақты сұхбатқа дайын болыңыз." },
      { property: "og:title", content: "AI Mock Interview — MJB" },
      { property: "og:description", content: "Стрестен арыл — AI HR-менеджермен жаттық." },
    ],
  }),
  component: Interview,
});

type Msg = { role: "user" | "assistant"; content: string };
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mock-interview`;

const ROLES = ["Официант", "Бариста", "Сатушы-консультант", "Курьер", "SMM маман", "Әкімші"];

function Interview() {
  const [role, setRole] = useState<string | null>(null);
  const [mode, setMode] = useState<"kind" | "strict">("kind");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function start(r: string) {
    setRole(r);
    const greeting: Msg = {
      role: "assistant",
      content: `Сәлем! Мен сіздің HR-менеджеріңізбін. Бүгін біз ${r} мамандығына сұхбат жүргіземіз. Дайынсыз ба? Алдымен өзіңіз туралы қысқаша айтып беріңізші.`,
    };
    setMessages([greeting]);
  }

  async function send() {
    if (!input.trim() || loading || !role) return;
    const userMsg: Msg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const assistantMsg: Msg = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, role, mode }),
      });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}));
        setMessages([...next, { role: "assistant", content: `❌ ${j.error || "Қате"}` }]);
        return;
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(data);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              setMessages((cur) => {
                const copy = [...cur];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch {
      setMessages((cur) => [...cur.slice(0, -1), { role: "assistant", content: "Желі қатесі" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6 flex flex-col">
        {!role ? (
          <div className="text-center max-w-xl mx-auto py-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-foreground">
              <Sparkles className="h-3 w-3" /> AI HR Симулятор
            </span>
            <h1 className="font-display mt-3 text-3xl md:text-4xl font-bold">
              Сұхбатқа алдын ала <span className="text-primary">дайындал</span>
            </h1>
            <p className="text-muted-foreground mt-3">
              Кез келген мамандықты таңда. AI HR-мен сөйлесу — стресті жояды.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setMode("kind")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "kind" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
              >
                😊 Жылы HR
              </button>
              <button
                onClick={() => setMode("strict")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "strict" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}
              >
                🔥 Қатал HR
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => start(r)}
                  className="rounded-2xl border border-border bg-card-gradient p-5 text-left shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg">{r}</span>
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Жаттығуды бастау</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
              <div className="text-sm">
                <span className="text-muted-foreground">Мамандық:</span>{" "}
                <span className="font-bold">{role}</span> ·{" "}
                <span className={mode === "strict" ? "text-destructive" : "text-success"}>
                  {mode === "strict" ? "🔥 Қатал" : "😊 Жылы"}
                </span>
              </div>
              <button onClick={() => { setRole(null); setMessages([]); }} className="text-xs text-primary font-semibold">Қалпына келтіру</button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}>
                    {m.content || (loading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "")}
                  </div>
                  {m.role === "user" && (
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gold flex items-center justify-center text-gold-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={loading}
                placeholder="Жауабыңызды жазыңыз..."
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-primary px-4 py-3 text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
