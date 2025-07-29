
"use client";

import { useWorkoutPlan } from "@/contexts/workout-plan-context";
import { WorkoutGeneratorCard } from "@/components/workout-generator-card";
import { useToast } from "@/hooks/use-toast";

export default function GeneratorPage() {
  const { setPlan } = useWorkoutPlan();
  const { toast } = useToast();

  const handlePlanGenerated = (newPlan: any) => {
    setPlan(newPlan);
    toast({
        title: "Plano Gerado com Sucesso!",
        description: "Seu novo plano de treino já está disponível em 'Meu Treino'.",
    })
  };

  return (
    <div className="flex justify-center items-start h-full">
        <div className="w-full max-w-2xl">
            <WorkoutGeneratorCard onPlanGenerated={handlePlanGenerated} />
        </div>
    </div>
  );
}
