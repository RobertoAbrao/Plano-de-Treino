"use client";

import { useState, useEffect, useMemo } from 'react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { WorkoutPlan, DayKey, Exercise } from '@/types/workout';
import { initialData } from '@/lib/initial-data';
import { dayNames } from '@/types/workout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ExerciseEditor } from '@/components/exercise-editor';
import { AiAdvisorCard } from '@/components/ai-advisor-card';

const LOCAL_STORAGE_KEY = 'workoutPlan_fase2';

export default function WorkoutDashboard() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<{ day: DayKey; exercise: Exercise | null } | null>(null);


  useEffect(() => {
    setIsClient(true);
    try {
      const savedPlan = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      } else {
        setPlan(initialData);
      }
    } catch (error) {
      console.error("Failed to load workout plan from local storage:", error);
      setPlan(initialData);
    }
  }, []);

  useEffect(() => {
    if (plan && isClient) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plan));
    }
  }, [plan, isClient]);

  const { totalExercises, completedExercises } = useMemo(() => {
    if (!plan) return { totalExercises: 0, completedExercises: 0 };
    let total = 0;
    let completed = 0;
    Object.values(plan).forEach(day => {
      total += day.exercises.length;
      completed += day.exercises.filter(ex => ex.completed).length;
    });
    return { totalExercises: total, completedExercises: completed };
  }, [plan]);

  const weeklyProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleToggleExercise = (day: DayKey, exerciseId: string) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newPlan = { ...prevPlan };
      const dayExercises = newPlan[day].exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );
      newPlan[day] = { ...newPlan[day], exercises: dayExercises };
      return newPlan;
    });
  };

  const handleOpenEditor = (day: DayKey, exercise: Exercise | null) => {
    setEditingInfo({ day, exercise });
    setEditorOpen(true);
  };

  const handleDeleteExercise = (day: DayKey, exerciseId: string) => {
     if (confirm('Tem certeza que deseja apagar este exercício?')) {
        setPlan(prevPlan => {
            if (!prevPlan) return null;
            const newPlan = { ...prevPlan };
            const dayExercises = newPlan[day].exercises.filter(ex => ex.id !== exerciseId);
            newPlan[day] = { ...newPlan[day], exercises: dayExercises };
            return newPlan;
        });
     }
  };

  const handleSaveExercise = (day: DayKey, exerciseData: Omit<Exercise, 'completed'>) => {
     setPlan(prevPlan => {
        if (!prevPlan) return null;
        const newPlan = { ...prevPlan };
        const dayExercises = [...newPlan[day].exercises];
        const existingIndex = dayExercises.findIndex(ex => ex.id === exerciseData.id);

        if (existingIndex > -1) {
            // Update existing
            const existingExercise = dayExercises[existingIndex];
            dayExercises[existingIndex] = { ...existingExercise, ...exerciseData };
        } else {
            // Add new
            dayExercises.push({ ...exerciseData, completed: false });
        }
        
        newPlan[day] = { ...newPlan[day], exercises: dayExercises };
        return newPlan;
     });
  };

  const handlePlanGenerated = (newPlan: WorkoutPlan) => {
    setPlan(newPlan);
  };

  if (!isClient || !plan) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-40" />
            <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-body">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-headline">Plano de treino</h1>
        <p className="mt-2 text-lg text-muted-foreground">Seu painel de controle para aumentar a intensidade, ganhar força e acelerar a queima de gordura.</p>
      </header>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Progresso Semanal</CardTitle>
            <CardDescription>Marque os exercícios concluídos para atualizar seu progresso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={weeklyProgress} className="h-4" />
            <p className="text-center text-sm font-medium text-primary mt-2">{Math.round(weeklyProgress)}% Completo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="segunda" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
                {(Object.keys(plan) as DayKey[]).map((day) => (
                    <TabsTrigger key={day} value={day}>{dayNames[day]}</TabsTrigger>
                ))}
            </TabsList>
            {(Object.keys(plan) as DayKey[]).map((day) => (
              <TabsContent key={day} value={day} className="mt-6">
                 <h2 className="text-2xl font-bold text-primary mb-4">{plan[day].title}</h2>
                 <div className="space-y-4">
                    {plan[day].exercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-item bg-background p-4 rounded-lg border flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex items-start flex-1">
                                <Checkbox 
                                    id={`${day}-${exercise.id}`}
                                    checked={exercise.completed}
                                    onCheckedChange={() => handleToggleExercise(day, exercise.id)}
                                    className="h-5 w-5 rounded mt-1"
                                />
                                <label htmlFor={`${day}-${exercise.id}`} className="ml-3 block text-sm w-full">
                                    <span className={`font-bold text-foreground ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>{exercise.name}</span>
                                    <span className="text-primary font-semibold ml-2">{exercise.reps}</span>
                                    <div className="text-muted-foreground mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exercise.notes }} />
                                </label>
                            </div>
                            <div className="flex gap-2 self-end sm:self-start">
                                <Button variant="outline" size="icon" onClick={() => handleOpenEditor(day, exercise)}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteExercise(day, exercise.id)}>
                                    <Trash2 className="h-4 w-4" />
                                     <span className="sr-only">Apagar</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => handleOpenEditor(day, null)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Exercício
                    </Button>
                 </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8">
        <AiAdvisorCard onPlanGenerated={handlePlanGenerated} />
      </div>

      <footer className="mt-8">
         <Card>
            <CardHeader>
                <CardTitle>Lembretes para a Fase 2</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="font-semibold text-primary">🎯 A Forma é Prioridade</p>
                        <p className="text-sm text-primary/80 mt-1">Nunca sacrifique a postura para levantar mais peso. É melhor fazer com menos peso e da forma correta.</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="font-semibold text-primary">⏱️ Descanse</p>
                        <p className="text-sm text-primary/80 mt-1">O descanso entre as séries pode ser um pouco maior agora, de 60 a 90 segundos, já que a carga é maior.</p>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="font-semibold text-primary">🧠 Sinta o Músculo</p>
                        <p className="text-sm text-primary/80 mt-1">Concentre-se no músculo que você está trabalhando. Isso melhora muito os resultados.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </footer>

      <ExerciseEditor 
        isOpen={isEditorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveExercise}
        editingInfo={editingInfo}
      />
    </div>
  );
}
