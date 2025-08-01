
"use client";

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import type { WorkoutPlan } from "@/types/workout"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

const focusColors: { [key: string]: string } = {
    'pernas': 'hsl(var(--chart-1))',
    'empurrar': 'hsl(var(--chart-2))',
    'puxar': 'hsl(var(--chart-3))',
    'cardio': 'hsl(var(--chart-4))',
    'core': 'hsl(var(--chart-4))',
    'full body': 'hsl(var(--chart-5))',
    'ombros': 'hsl(var(--chart-2))',
    'peito': 'hsl(var(--chart-2))',
    'costas': 'hsl(var(--chart-3))',
    'bracos': 'hsl(var(--chart-3))',
    'descanso': 'hsl(var(--muted))',
    'outro': 'hsl(var(--muted))',
};

const getFocusKey = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pernas')) return 'pernas';
    if (lowerTitle.includes('empurrar') || lowerTitle.includes('peito') || lowerTitle.includes('ombro')) return 'empurrar';
    if (lowerTitle.includes('puxar') || lowerTitle.includes('costas')) return 'puxar';
    if (lowerTitle.includes('cardio') && lowerTitle.includes('core')) return 'cardio';
    if (lowerTitle.includes('cardio')) return 'cardio';
    if (lowerTitle.includes('core')) return 'core';
    if (lowerTitle.includes('full body')) return 'full body';
    if (lowerTitle.includes('braços')) return 'bracos';
    if (lowerTitle.includes('descanso')) return 'descanso';
    return 'outro';
};

const chartConfig = {
  days: {
    label: "Dias",
  },
  pernas: {
    label: "Pernas",
    color: "hsl(var(--chart-1))",
  },
  empurrar: {
    label: "Empurrar",
    color: "hsl(var(--chart-2))",
  },
  puxar: {
    label: "Puxar",
    color: "hsl(var(--chart-3))",
  },
  cardio: {
    label: "Cardio/Core",
    color: "hsl(var(--chart-4))",
  },
  'full body': {
    label: "Full Body",
    color: "hsl(var(--chart-5))",
  },
  bracos: {
    label: "Braços",
    color: "hsl(var(--chart-3))",
  },
  descanso: {
    label: "Descanso",
    color: "hsl(var(--muted))",
  },
  outro: {
    label: "Outro",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

interface FocusChartProps {
  plan: WorkoutPlan | null;
}

export function FocusChart({ plan }: FocusChartProps) {
  const chartData = React.useMemo(() => {
    if (!plan) return [];
    
    const focusCounts: { [key: string]: number } = {
        pernas: 0, empurrar: 0, puxar: 0, cardio: 0, 'full body': 0, bracos: 0, descanso: 0, outro: 0
    };

    Object.values(plan).forEach(day => {
        if (day && day.title) {
            const focusKey = getFocusKey(day.title);
            if (focusCounts.hasOwnProperty(focusKey)) {
                focusCounts[focusKey]++;
            }
        }
    });

    return Object.entries(focusCounts)
        .map(([focus, value]) => ({ name: (chartConfig[focus as keyof typeof chartConfig] as any)?.label, value, fill: focusColors[focus], focus }))
        .filter(d => d.value > 0);

  }, [plan]);

  const totalDays = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData]);


  if (chartData.length === 0) {
      return null;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Foco da Semana</CardTitle>
        <CardDescription>Distribuição dos seus treinos</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-[250px] h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
            >
               {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} name={entry.name} />
                ))}
            </Pie>
            <ChartLegend
                content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />}
                payload={chartData.map(item => ({
                    value: item.name,
                    type: 'square',
                    color: item.fill,
                }))}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm pt-4">
        {/* The legend is now rendered inside the ChartContainer */}
      </CardFooter>
    </Card>
  )
}
