"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DayKey, Exercise } from "@/types/workout";

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
                  <FormControl>
                    <Input placeholder="Ex: Supino na Máquina" {...field} />
                  </FormControl>
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
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Aumente a carga, mantendo a postura."
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
