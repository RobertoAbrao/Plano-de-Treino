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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-center">Foco da Semana</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="focus"
              innerRadius="70%"
              strokeWidth={5}
            />
            <ChartLegend content={<ChartLegendContent nameKey="focus" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
