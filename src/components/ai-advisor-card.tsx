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
  onPlanGenerated: (newPlan: WorkoutPlan) => void;
}

export function AiAdvisorCard({ onPlanGenerated }: AiAdvisorCardProps) {
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
    try {
      const result = await getWorkoutAdvice({
        fitnessGoal: data.fitnessGoal,
      });
      onPlanGenerated(result);
      form.reset();
    } catch (e) {
      setError("Não foi possível gerar o treino. Tente novamente.");
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
          Gerador de Treino com IA
        </CardTitle>
        <CardDescription>
          Não sabe por onde começar? Descreva seu objetivo principal e a nossa IA criará um plano de treino de 5 dias, completo e personalizado para você.
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
                  Gerando seu plano...
                </>
              ) : (
                "Gerar Treino"
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
      </CardContent>
    </Card>
  );
}
