import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, PhoneCall, PhoneOff, PhoneOutgoing, Pause, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard } from "@/components/common/MetricCard";
import { Pill } from "@/components/common/StatusBadge";
import { AiDisclaimer, AiOutputBlock, AiStepLabel } from "@/components/common/AiPanel";
import { useBoosterAi } from "@/lib/use-booster-ai";
import { calls, consultantById, customerById, formatSeconds } from "@/data/demo";

export const Route = createFileRoute("/call-centre")({
  head: () => ({
    meta: [
      { title: "Call Centre | Booster Hub" },
      {
        name: "description",
        content: "Handle incoming and outgoing calls, log outcomes, capture notes and generate AI call summaries in Booster Hub.",
      },
      { property: "og:title", content: "Call Centre | Booster Hub" },
      { property: "og:description", content: "Softphone controls, call history and AI call summaries." },
    ],
  }),
  component: CallCentre;
});

function CallCentre() {
  return null;
}
