"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, LoaderCircle } from "lucide-react";
import type { WorkoutPlan } from "@/types/workout";
import { getWorkoutAdvice } from "@/ai/flows/workout-advisor";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const advisorSchema = z.object({
  fitnessGoal: z.string().min(3, { message: "Por favor, descreva seu objetivo." }),
});

type AdvisorFormData = z.infer<typeof advisorSchema>;

interface AiAdvisorCardProps {
  plan: WorkoutPlan;
}

export function AiAdvisorCard({ plan }: AiAdvisorCardProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdvisorFormData>({
    resolver: zodResolver(advisorSchema),
    defaultValues: {
      fitnessGoal: "",
    },
  });

  const handleSubmit = async (data: AdvisorFormData) => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result = await getWorkoutAdvice({
        workoutPlan: JSON.stringify(plan),
        fitnessGoal: data.fitnessGoal,
      });
      setAdvice(result.advice);
    } catch (e) {
      setError("Não foi possível obter a sugestão. Tente novamente.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Assistente de Treino IA
        </CardTitle>
        <CardDescription>
          Receba dicas personalizadas para otimizar seu treino com base no seu objetivo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fitnessGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual seu objetivo principal?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Perder gordura, ganhar massa muscular" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                "Obter Sugestão"
              )}
            </Button>
          </form>
        </Form>

        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {advice && (
            <Alert variant="default" className="mt-4">
                 <AlertTitle className="font-bold">Sugestão do Assistente</AlertTitle>
                 <AlertDescription className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {advice}
                 </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
