import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mood } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt based on mood
    const moodPrompts = {
      energized: "The user is feeling energized and motivated. Give them ambitious, action-oriented suggestions with high energy.",
      calm: "The user is feeling calm and centered. Provide thoughtful, measured suggestions that maintain their peace.",
      focused: "The user is in a focused state. Give clear, direct guidance with minimal distractions.",
      overwhelmed: "The user is feeling overwhelmed. Break things down into small, manageable steps and be reassuring.",
      neutral: "The user is in a neutral state. Provide balanced, versatile guidance.",
    };

    const systemPrompt = `You are a clarity and productivity AI assistant. Your role is to help users move from confusion to actionable clarity.

Core capabilities:
- Generate next steps and prioritize tasks
- Provide mood-aware suggestions
- Create to-do lists
- Offer decision guidance
- Suggest micro-habits and time optimization

Current user mood: ${mood}
${moodPrompts[mood as keyof typeof moodPrompts]}

When asked to create a visual plan, respond with "I'll create a visual plan for you" and include the keyword [GENERATE_IMAGE] followed by a detailed description of what should be visualized.

When creating to-do lists, structure them clearly with numbered items. Use the keyword [TASK_LIST] followed by each task on a new line.

Be concise, actionable, and encouraging. Focus on reducing cognitive load and providing clarity.`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let messageContent = data.choices[0].message.content;

    // Check if we need to generate an image
    let imageUrl = null;
    if (messageContent.includes("[GENERATE_IMAGE]")) {
      const imageMatch = messageContent.match(/\[GENERATE_IMAGE\]\s*(.+?)(?=\n\n|\[|$)/s);
      if (imageMatch) {
        const imagePrompt = imageMatch[1].trim();
        messageContent = messageContent.replace(/\[GENERATE_IMAGE\].+?(?=\n\n|\[|$)/s, "").trim();

        try {
          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [
                { role: "user", content: `Create a clean, professional visual plan diagram: ${imagePrompt}` },
              ],
              modalities: ["image", "text"],
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageUrl = imageData.choices[0].message.images?.[0]?.image_url?.url;
          }
        } catch (imageError) {
          console.error("Image generation error:", imageError);
        }
      }
    }

    // Extract tasks if present
    let tasks = null;
    if (messageContent.includes("[TASK_LIST]")) {
      const taskMatch = messageContent.match(/\[TASK_LIST\]\s*(.+?)(?=\n\n|$)/s);
      if (taskMatch) {
        tasks = taskMatch[1]
          .trim()
          .split("\n")
          .map((task: string) => task.replace(/^\d+\.\s*/, "").trim())
          .filter((task: string) => task.length > 0);
        messageContent = messageContent.replace(/\[TASK_LIST\].+?(?=\n\n|$)/s, "").trim();
      }
    }

    return new Response(
      JSON.stringify({
        message: messageContent,
        imageUrl,
        tasks,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in clarity-assistant function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
