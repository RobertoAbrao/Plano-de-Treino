export interface Exercise {
  id: string;
  name: string;
  reps: string;
  notes: string;
  completed: boolean;
}

export type DayKey = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta';

export const dayNames: Record<DayKey, string> = {
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
};

export interface DayWorkout {
  title: string;
  exercises: Exercise[];
}

export type WorkoutPlan = Record<DayKey, DayWorkout>;
