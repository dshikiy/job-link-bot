// Parse free-text vacancy → structured fields
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an HR assistant for Aktau, Kazakhstan. Convert raw employer messages (Kazakh/Russian) into a structured vacancy. Detect microdistrict in format 'X мкр'. Salary in KZT. Be conservative; if data missing, leave empty." },
          { role: "user", content: text },
        ],
        tools: [{
          type: "function",
          function: {
            name: "build_vacancy",
            description: "Structured vacancy",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                company: { type: "string" },
                district: { type: "string" },
                salary_min: { type: "number" },
                salary_max: { type: "number" },
                description: { type: "string" },
                requirements: { type: "array", items: { type: "string" } },
                skills: { type: "array", items: { type: "string" } },
                employment_type: { type: "string", enum: ["full_time", "part_time", "remote", "internship"] },
                is_urgent: { type: "boolean" },
              },
              required: ["title", "company", "district", "description", "requirements", "skills", "employment_type", "is_urgent"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "build_vacancy" } },
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Лимит асып кетті" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Кредит таусылды" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI қатесі" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const j = await r.json();
    const args = j?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const vacancy = args ? JSON.parse(args) : null;

    return new Response(JSON.stringify({ vacancy }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
