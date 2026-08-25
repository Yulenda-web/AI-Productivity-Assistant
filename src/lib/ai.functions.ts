import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  feature: z.string().min(1),
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const runBoosterAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const { generateGatewayText } = await import("./ai-gateway.server");
    const result = await generateGatewayText(data.system, data.prompt);
    return { feature: data.feature, text: result.text, error: result.error ?? null };
  });
