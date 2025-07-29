
"use client";

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import type { WorkoutPlan, DayKey, Exercise } from '@/types/workout';
import { initialData } from '@/lib/initial-data';
import { getWorkoutAdvice } from '@/ai/flows/workout-advisor';

const LOCAL_STORAGE_KEY = 'workoutPlan_fase2';

interface WorkoutPlanContextType {
  plan: WorkoutPlan | null;
  setPlan: (plan: WorkoutPlan) => void;
  updateExercise: (day: DayKey, exercise: Exercise) => void;
  deleteExercise: (day: DayKey, exerciseId: string) => void;
  addExercise: (day: DayKey, exerciseData: Omit<Exercise, 'completed'>) => void;
  updateDayTitle: (day: DayKey, newTitle: string) => void;
  generatePlan: (goal: string, level: "iniciante" | "intermediario" | "avancado", gender: "homem" | "mulher") => Promise<void>;
  isLoading: boolean;
  isGenerating: boolean;
}

const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(undefined);

export const WorkoutPlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlanState] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPlan) {
        setPlanState(JSON.parse(savedPlan));
      } else {
        setPlanState(initialData);
      }
    } catch (error) {
      console.error("Failed to load workout plan from local storage:", error);
      setPlanState(initialData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPlan = useCallback((newPlan: WorkoutPlan) => {
    setPlanState(newPlan);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlan));
  }, []);

  const updatePlan = (updater: (prevPlan: WorkoutPlan) => WorkoutPlan) => {
    setPlanState(prevPlan => {
      if (!prevPlan) return null;
      const newPlan = updater(prevPlan);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlan));
      return newPlan;
    });
  };

  const updateExercise = (day: DayKey, exercise: Exercise) => {
    updatePlan(prevPlan => {
      const dayExercises = prevPlan[day].exercises.map(ex =>
        ex.id === exercise.id ? exercise : ex
      );
      return { ...prevPlan, [day]: { ...prevPlan[day], exercises: dayExercises } };
    });
  };

  const deleteExercise = (day: DayKey, exerciseId: string) => {
    updatePlan(prevPlan => {
      const dayExercises = prevPlan[day].exercises.filter(ex => ex.id !== exerciseId);
      return { ...prevPlan, [day]: { ...prevPlan[day], exercises: dayExercises } };
    });
  };

  const addExercise = (day: DayKey, exerciseData: Omit<Exercise, 'completed'>) => {
    updatePlan(prevPlan => {
      const newExercise: Exercise = {
        ...exerciseData,
        id: exerciseData.id || crypto.randomUUID(),
        completed: false,
      };
      const dayExercises = [...prevPlan[day].exercises, newExercise];
      return { ...prevPlan, [day]: { ...prevPlan[day], exercises: dayExercises } };
    });
  };

  const updateDayTitle = (day: DayKey, newTitle: string) => {
     updatePlan(prevPlan => ({
        ...prevPlan,
        [day]: { ...prevPlan[day], title: newTitle }
     }));
  };

  const generatePlan = async (goal: string, level: "iniciante" | "intermediario" | "avancado", gender: "homem" | "mulher") => {
    setIsGenerating(true);
    try {
        const result = await getWorkoutAdvice({ fitnessGoal: goal, fitnessLevel: level, gender: gender });
        setPlan(result);
    } catch (e) {
        console.error("Failed to generate workout plan:", e);
        throw e; // re-throw to be caught by the component
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <WorkoutPlanContext.Provider value={{
      plan,
      setPlan,
      updateExercise,
      deleteExercise,
      addExercise,
      updateDayTitle,
      generatePlan,
      isLoading,
      isGenerating
    }}>
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (context === undefined) {
    throw new Error('useWorkoutPlan must be used within a WorkoutPlanProvider');
  }
  return context;
};
