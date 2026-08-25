const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-5.6-sol";

export interface GatewayResult {
  text: string;
  error?: string;
}

/** Calls the Lovable AI Gateway Responses API and returns plain text. */
export async function generateGatewayText(system: string, prompt: string): Promise<GatewayResult> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { text: "", error: "AI is not configured for this workspace." };

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      input: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 429) {
      return { text: "", error: "Booster AI is rate limited right now. Please try again shortly." };
    }
    if (response.status === 402) {
      return { text: "", error: "AI credits are exhausted for this workspace. Please add credits to continue." };
    }
    if (response.status === 403) {
      return { text: "", error: "Booster AI is disabled by workspace policy." };
    }
    return { text: "", error: `Booster AI request failed (${response.status}). ${detail.slice(0, 200)}` };
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: { content?: { type?: string; text?: string }[] }[];
  };

  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return { text: data.output_text.trim() };
  }

  const text = (data.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type !== "reasoning" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("\n")
    .trim();

  return text ? { text } : { text: "", error: "Booster AI returned an empty response." };
}
