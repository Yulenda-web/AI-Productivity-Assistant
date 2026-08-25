import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runBoosterAi } from "@/lib/ai.functions";

export function useBoosterAi() {
  const run = useServerFn(runBoosterAi);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (feature: string, system: string, prompt: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await run({ data: { feature, system, prompt } });
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          setOutput(null);
          return null;
        }
        setOutput(result.text);
        return result.text;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Booster AI request failed.";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [run],
  );

  return { generate, loading, output, setOutput, error };
}
