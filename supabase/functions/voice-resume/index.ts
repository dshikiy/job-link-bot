// Voice → AI Resume
// Receives base64 audio, transcribes via Lovable AI, then structures it via tool calling.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResumeOut {
  full_name: string;
  age?: number;
  district?: string;
  summary: string;
  experience: { role: string; company?: string; period?: string; details?: string }[];
  skills: string[];
  languages: string[];
  desired_role?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transcript, audio_base64, mime_type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    let text = transcript as string | undefined;

    // If client sent audio, attempt transcription via Gemini multimodal
    if (!text && audio_base64) {
      const tr = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Transcribe this audio verbatim. Return only the transcription text in the original language (Kazakh/Russian)." },
                { type: "input_audio", input_audio: { data: audio_base64, format: mime_type?.includes("mp3") ? "mp3" : "wav" } },
              ],
            },
          ],
        }),
      });
      const trJson = await tr.json();
      text = trJson?.choices?.[0]?.message?.content || "";
    }

    if (!text || text.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Empty transcript" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Structured extraction
    const ai = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You convert spoken self-introductions (Kazakh or Russian) into clean, structured resume JSON for young job seekers in Aktau, Kazakhstan. Be honest, do NOT invent data. If a field is missing, omit it. Keep summary in the same language as the input.",
          },
          { role: "user", content: text },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "build_resume",
              description: "Return a structured resume.",
              parameters: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  age: { type: "number" },
                  district: { type: "string", description: "Aktau microdistrict, e.g. '14 мкр'" },
                  summary: { type: "string", description: "2-3 sentence professional summary" },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string" },
                        company: { type: "string" },
                        period: { type: "string" },
                        details: { type: "string" },
                      },
                      required: ["role"],
                    },
                  },
                  skills: { type: "array", items: { type: "string" } },
                  languages: { type: "array", items: { type: "string" } },
                  desired_role: { type: "string" },
                },
                required: ["full_name", "summary", "skills", "experience", "languages"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "build_resume" } },
      }),
    });

    if (!ai.ok) {
      const t = await ai.text();
      console.error("AI error", ai.status, t);
      return new Response(JSON.stringify({ error: ai.status === 429 ? "Лимит асып кетті" : ai.status === 402 ? "Кредит таусылды" : "AI қатесі" }), {
        status: ai.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const out = await ai.json();
    const args = out?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const resume: ResumeOut = args ? JSON.parse(args) : { full_name: "Кандидат", summary: text, skills: [], experience: [], languages: [] };

    return new Response(JSON.stringify({ transcript: text, resume }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("voice-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
