
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DayKey, Exercise } from "@/types/workout";
import { exerciseList } from "@/lib/exercises";
import { exerciseDescriptions } from "@/lib/exercise-descriptions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";


const exerciseSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  reps: z.string().min(1, { message: "Séries/Reps são obrigatórias." }),
  notes: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface ExerciseEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (day: DayKey, exercise: Omit<Exercise, 'completed'>) => void;
  editingInfo: { day: DayKey; exercise: Exercise | null } | null;
}

export function ExerciseEditor({ isOpen, onOpenChange, onSave, editingInfo }: ExerciseEditorProps) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      reps: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen && editingInfo) {
      form.reset(
        editingInfo.exercise
          ? {
              name: editingInfo.exercise.name,
              reps: editingInfo.exercise.reps,
              notes: editingInfo.exercise.notes.replace(/<[^>]*>?/gm, ''), // Strip HTML for editing
            }
          : {
              name: "",
              reps: "",
              notes: "",
            }
      );
    }
  }, [isOpen, editingInfo, form]);

  const handleExerciseChange = (exerciseName: string) => {
    if (!exerciseName) return;
    
    form.setValue("name", exerciseName);
    const description = exerciseDescriptions[exerciseName] || "Descrição não encontrada.";
    form.setValue("notes", description);
  };

  const handleSubmit = (data: ExerciseFormData) => {
    if (editingInfo) {
        const exerciseToSave = {
            id: editingInfo.exercise?.id || crypto.randomUUID(),
            ...data,
        };
        onSave(editingInfo.day, exerciseToSave);
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingInfo?.exercise ? "Editar Exercício" : "Adicionar Exercício"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Exercício</FormLabel>
                   <Select onValueChange={handleExerciseChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um exercício" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-72">
                        {exerciseList.map((exercise) => (
                          <SelectItem key={exercise} value={exercise}>
                            {exercise}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Séries & Repetições</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3x 8-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                        Notas
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Selecione um exercício para ver a descrição."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
