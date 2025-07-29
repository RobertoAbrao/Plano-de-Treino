
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const advisorSchema = z.object({
  fitnessGoal: z.string().min(3, { message: "Por favor, descreva seu objetivo." }),
  fitnessLevel: z.enum(["iniciante", "intermediario", "avancado"], {
    required_error: "Você precisa selecionar um nível.",
  }),
  gender: z.enum(["homem", "mulher"], {
    required_error: "Você precisa selecionar um gênero.",
  }),
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
        fitnessLevel: data.fitnessLevel,
        gender: data.gender,
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
          Não sabe por onde começar? Descreva seu objetivo, selecione seu nível e a nossa IA criará um plano de treino de 5 dias, completo e personalizado para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Qual seu nível de experiência?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-y-0 space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="iniciante" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Iniciante
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="intermediario" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Intermediário
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="avancado" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Avançado
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Qual seu gênero?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-y-0 space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="homem" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Homem
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="mulher" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Mulher
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
