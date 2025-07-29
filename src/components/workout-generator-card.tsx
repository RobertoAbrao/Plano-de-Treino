
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, LoaderCircle } from "lucide-react";
import { useWorkoutPlan } from "@/contexts/workout-plan-context";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const generatorSchema = z.object({
  fitnessGoal: z.string().min(3, { message: "Por favor, descreva seu objetivo." }),
  fitnessLevel: z.enum(["iniciante", "intermediario", "avancado"], {
    required_error: "Você precisa selecionar um nível.",
  }),
  gender: z.enum(["homem", "mulher"], {
    required_error: "Você precisa selecionar um gênero.",
  }),
});

type GeneratorFormData = z.infer<typeof generatorSchema>;

interface WorkoutGeneratorCardProps {
  onPlanGenerated: (newPlan: any) => void;
}

export function WorkoutGeneratorCard({ onPlanGenerated }: WorkoutGeneratorCardProps) {
  const [error, setError] = useState<string | null>(null);
  const { generatePlan, isGenerating } = useWorkoutPlan();

  const form = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      fitnessGoal: "",
    },
  });

  const handleSubmit = async (data: GeneratorFormData) => {
    setError(null);
    try {
      const result = await generatePlan(data.fitnessGoal, data.fitnessLevel, data.gender);
      onPlanGenerated(result);
      form.reset();
    } catch (e) {
      setError("Não foi possível gerar o treino. Tente novamente.");
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          Gerador de Treino
        </CardTitle>
        <CardDescription>
          Não sabe por onde começar? Descreva seu objetivo, selecione seu nível e nosso sistema criará um plano de treino de 5 dias, completo e personalizado para você.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="flex flex-col space-y-2"
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
                        className="flex flex-col space-y-2"
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
            <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto">
              {isGenerating ? (
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
