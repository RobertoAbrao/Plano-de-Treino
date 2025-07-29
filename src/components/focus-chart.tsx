"use client";

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { focus: "Pernas", value: 1, fill: "hsl(var(--primary))" },
  { focus: "Empurrar", value: 1, fill: "hsl(var(--primary) / 0.9)" },
  { focus: "Puxar", value: 1, fill: "hsl(var(--primary) / 0.7)" },
  { focus: "Cardio/Core", value: 1, fill: "hsl(var(--primary) / 0.5))" },
  { focus: "Full Body", value: 1, fill: "hsl(var(--primary) / 0.3))" },
]

const chartConfig = {
  value: {
    label: "Dias",
  },
  Pernas: { label: "Pernas" },
  Empurrar: { label: "Empurrar" },
  Puxar: { label: "Puxar" },
  "Cardio/Core": { label: "Cardio/Core" },
  "Full Body": { label: "Full Body" },
}

export function FocusChart() {
  return (
    null
  )
}
