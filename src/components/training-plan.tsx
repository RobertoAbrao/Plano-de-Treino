
"use client";

import { useState } from "react";
import { Pencil, PlusCircle, Trash2, Timer } from "lucide-react";
import { useWorkoutPlan } from "@/contexts/workout-plan-context";
import type { DayKey, Exercise } from "@/types/workout";
import { dayNames } from "@/types/workout";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseEditor } from "@/components/exercise-editor";
import { Input } from "@/components/ui/input";
import { TimerModal } from "@/components/timer-modal";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const dayOrder: DayKey[] = ["segunda", "terca", "quarta", "quinta", "sexta"];

export function TrainingPlan() {
  const { plan, updateExercise, deleteExercise, addExercise, updateDayTitle, isLoading } = useWorkoutPlan();
  
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<{ day: DayKey; exercise: Exercise | null } | null>(null);
  const [isTimerOpen, setTimerOpen] = useState(false);

  const handleToggleExercise = (day: DayKey, exerciseId: string, completed: boolean) => {
    const exercise = plan?.[day]?.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
        updateExercise(day, { ...exercise, completed });
    }
  };

  const handleOpenEditor = (day: DayKey, exercise: Exercise | null) => {
    setEditingInfo({ day, exercise });
    setEditorOpen(true);
  };

  const handleSaveExercise = (day: DayKey, exerciseData: Omit<Exercise, 'completed'>) => {
    if (editingInfo?.exercise) { // Editing existing
        updateExercise(day, { ...editingInfo.exercise, ...exerciseData });
    } else { // Adding new
        addExercise(day, exerciseData);
    }
  };


  if (isLoading || !plan) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Meu Treino</h1>
            <p className="mt-2 text-lg text-muted-foreground">Sua jornada para a melhor versão de si mesmo começa aqui.</p>
        </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="segunda" className="w-full">
            <div className="flex justify-between items-center mb-4">
                <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList className="inline-flex h-auto">
                        {dayOrder.map((day) => (
                        <TabsTrigger key={day} value={day}>
                            {dayNames[day]}
                        </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                 <Button onClick={() => setTimerOpen(true)} className="ml-4 hidden sm:inline-flex">
                    <Timer className="mr-2 h-5 w-5" />
                    Timer
                </Button>
            </div>
           
            {dayOrder.map((day) =>
              plan[day] ? (
                <TabsContent key={day} value={day} className="mt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                    <Input
                      value={plan[day]!.title}
                      onChange={(e) => updateDayTitle(day, e.target.value)}
                      className="text-xl font-bold h-auto p-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 tracking-tight bg-transparent"
                    />
                     <Button onClick={() => setTimerOpen(true)} className="w-full sm:hidden">
                        <Timer className="mr-2 h-5 w-5" />
                        Timer de Descanso
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {plan[day]!.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="exercise-item bg-card p-3 rounded-lg border flex items-start gap-4 transition-all hover:border-primary/50"
                      >
                        <Checkbox
                          id={`${day}-${exercise.id}`}
                          checked={exercise.completed}
                          onCheckedChange={(checked) =>
                            handleToggleExercise(day, exercise.id, !!checked)
                          }
                          className="h-5 w-5 rounded mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={`${day}-${exercise.id}`} className="block w-full cursor-pointer">
                            <span
                              className={`font-semibold text-base text-foreground ${
                                exercise.completed
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {exercise.name}
                            </span>
                            <span className="text-primary font-bold ml-2 text-base">
                              {exercise.reps}
                            </span>
                            <div
                              className="text-muted-foreground mt-1 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: exercise.notes }}
                            />
                          </label>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 -mr-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenEditor(day, exercise)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Apagar</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso irá apagar permanentemente o exercício do seu plano de treino.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteExercise(day, exercise.id)}>Apagar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleOpenEditor(day, null)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Exercício
                    </Button>
                  </div>
                </TabsContent>
              ) : null
            )}
          </Tabs>
        </CardContent>
      </Card>

      <ExerciseEditor
        isOpen={isEditorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveExercise}
        editingInfo={editingInfo}
      />

      <TimerModal isOpen={isTimerOpen} onOpenChange={setTimerOpen} />
    </div>
  );
}
