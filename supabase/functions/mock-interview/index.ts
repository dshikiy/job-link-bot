// AI Mock Interview — streaming HR simulator
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, role = "Официант", mode = "kind" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const persona = mode === "strict"
      ? "Сен қатал, талап қойғыш HR-менеджерсің. Қысқа, нақты сұрақ қой. Жауаптарға сын айтасың."
      : "Сен жылы, қолдаушы HR-менеджерсің. Кандидатты тыныштандыр, ашық сұрақтар қой.";

    const system = `${persona}\n\nСен ${role} мамандығына кандидатпен сұхбат жүргізіп жатырсың. Қазақша немесе орысша жауап бер — кандидат қай тілде жазса, сол тілде. Бір рет тек 1 сұрақ қой. 5-7 алмасудан кейін соңғы хабарламада 3-4 нақты кеңес бер: "Күшті жақтарың:", "Жақсартатын тұстарың:", "Менің кеңесім:".`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...messages],
        stream: true,
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Лимит асып кетті, кейінірек көріңіз" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Кредит таусылды" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      console.error("gateway", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway қатесі" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(r.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mock-interview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
