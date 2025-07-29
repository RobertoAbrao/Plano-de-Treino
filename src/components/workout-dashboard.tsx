
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Pencil, PlusCircle, Trash2, Timer, Dumbbell } from 'lucide-react';
import type { WorkoutPlan, DayKey, Exercise, Reminder } from '@/types/workout';
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
import { Input } from '@/components/ui/input';
import { TimerModal } from '@/components/timer-modal';
import { FocusChart } from '@/components/focus-chart';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


const LOCAL_STORAGE_KEY = 'workoutPlan_fase2';

const dayOrder: DayKey[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

export default function WorkoutDashboard() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<{ day: DayKey; exercise: Exercise | null } | null>(null);
  const [isTimerOpen, setTimerOpen] = useState(false);


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

  const { totalExercises, completedExercises, reminders } = useMemo(() => {
    if (!plan) return { totalExercises: 0, completedExercises: 0, reminders: [] };

    let total = 0;
    let completed = 0;
    Object.values(plan).forEach(day => {
        if(day && Array.isArray(day.exercises)) {
            total += day.exercises.length;
            completed += day.exercises.filter(ex => ex.completed).length;
        }
    });

    const currentReminders = plan.reminders || [];

    return { totalExercises: total, completedExercises: completed, reminders: currentReminders };
  }, [plan]);

  const weeklyProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const handleToggleExercise = (day: DayKey, exerciseId: string) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newPlan = { ...prevPlan };
      if (newPlan[day]) {
          const dayExercises = newPlan[day].exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          );
          newPlan[day] = { ...newPlan[day], exercises: dayExercises };
      }
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
            if (newPlan[day]) {
                const dayExercises = newPlan[day].exercises.filter(ex => ex.id !== exerciseId);
                newPlan[day] = { ...newPlan[day], exercises: dayExercises };
            }
            return newPlan;
        });
     }
  };

  const handleTitleChange = (day: DayKey, newTitle: string) => {
    setPlan(prevPlan => {
        if (!prevPlan) return null;
        const newPlan = { ...prevPlan };
        if (newPlan[day]) {
            newPlan[day] = { ...newPlan[day], title: newTitle };
        }
        return newPlan;
    });
  };

  const handleSaveExercise = (day: DayKey, exerciseData: Omit<Exercise, 'completed'>) => {
     setPlan(prevPlan => {
        if (!prevPlan) return null;
        const newPlan = { ...prevPlan };
         if (newPlan[day]) {
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
         }
        return newPlan;
     });
  };

  const handlePlanGenerated = (newPlan: WorkoutPlan) => {
    setPlan(newPlan);
  };

  if (!isClient || !plan) {
    return (
      <div className="min-h-screen bg-background w-full">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-96" />
                <div className="space-y-8">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-60" />
                </div>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
             <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Painel de Treino</h1>
                <p className="mt-2 text-lg text-muted-foreground">Sua jornada para a melhor versão de si mesmo começa aqui.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                        <Tabs defaultValue="segunda" className="w-full">
                            <ScrollArea className="w-full whitespace-nowrap">
                                <TabsList className="inline-flex h-auto">
                                    {dayOrder.map((day) => (
                                        <TabsTrigger key={day} value={day}>{dayNames[day]}</TabsTrigger>
                                    ))}
                                </TabsList>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            {dayOrder.map((day) => (
                            plan[day] && <TabsContent key={day} value={day} className="mt-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                                     <Input
                                        value={plan[day]!.title}
                                        onChange={(e) => handleTitleChange(day, e.target.value)}
                                        className="text-xl font-bold h-auto p-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 tracking-tight bg-transparent"
                                        />
                                    <Button onClick={() => setTimerOpen(true)} className="w-full sm:w-auto">
                                        <Timer className="mr-2 h-5 w-5" />
                                        Timer de Descanso
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {plan[day]!.exercises.map((exercise) => (
                                        <div key={exercise.id} className="exercise-item bg-background p-3 rounded-lg border flex items-start gap-4 transition-all hover:border-primary/50">
                                            <Checkbox 
                                                id={`${day}-${exercise.id}`}
                                                checked={exercise.completed}
                                                onCheckedChange={() => handleToggleExercise(day, exercise.id)}
                                                className="h-5 w-5 rounded mt-1"
                                            />
                                            <div className="flex-1">
                                                <label htmlFor={`${day}-${exercise.id}`} className="block w-full">
                                                    <span className={`font-semibold text-base text-foreground ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>{exercise.name}</span>
                                                    <span className="text-primary font-bold ml-2 text-base">{exercise.reps}</span>
                                                    <div className="text-muted-foreground mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exercise.notes }} />
                                                </label>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-1 -mr-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditor(day, exercise)}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Editar</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8" onClick={() => handleDeleteExercise(day, exercise.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Apagar</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full mt-4" onClick={() => handleOpenEditor(day, null)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Adicionar Exercício
                                    </Button>
                                </div>
                            </TabsContent>
                            ))}
                        </Tabs>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lembretes para o Sucesso</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {!reminders || reminders.length === 0 ? (
                                <div className="text-center text-muted-foreground bg-muted/50 p-6 rounded-lg">
                                    <p>Nenhum lembrete gerado ainda.</p>
                                    <p>Use o Gerador com IA para criar lembretes personalizados para o seu treino!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                {reminders.map((reminder, index) => (
                                    <div key={index} className="bg-background border p-4 rounded-lg">
                                        <p className="font-semibold text-primary">{reminder.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                                    </div>
                                ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Lateral */}
                <aside className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Progresso Semanal</CardTitle>
                            <CardDescription>Conclua seus treinos e veja sua barra de progresso encher.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={weeklyProgress} className="h-3" />
                            <p className="text-right text-sm font-medium text-muted-foreground mt-2">{Math.round(weeklyProgress)}% Completo</p>
                        </CardContent>
                    </Card>

                    <FocusChart plan={plan} />
                    
                    <AiAdvisorCard onPlanGenerated={handlePlanGenerated} />
                </aside>
            </div>

            <ExerciseEditor 
                isOpen={isEditorOpen}
                onOpenChange={setEditorOpen}
                onSave={handleSaveExercise}
                editingInfo={editingInfo}
            />

            <TimerModal 
                isOpen={isTimerOpen}
                onOpenChange={setTimerOpen}
            />
        </main>
    </div>
  );
}

    