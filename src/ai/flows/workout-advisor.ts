
'use server';

/**
 * @fileOverview Workout advisor AI agent.
 *
 * - getWorkoutAdvice - A function that provides personalized workout advice and exercise modifications.
 * - WorkoutAdvisorInput - The input type for the getWorkoutAdvice function.
 * - WorkoutAdvisorOutput - The return type for the getWorkoutAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { exerciseList } from '@/lib/exercises';


const WorkoutAdvisorInputSchema = z.object({
  fitnessGoal: z.string().describe('The fitness goal of the user.'),
  fitnessLevel: z.enum(["iniciante", "intermediario", "avancado"]).describe("The fitness level of the user (beginner, intermediate, or advanced)."),
});
export type WorkoutAdvisorInput = z.infer<typeof WorkoutAdvisorInputSchema>;

const ExerciseSchema = z.object({
    id: z.string().describe("A unique identifier for the exercise for that day, like 'seg-1', 'ter-1', etc."),
    name: z.string().describe('The name of the exercise.'),
    reps: z.string().describe("The suggested sets and repetitions, like '3x 10-12'."),
    notes: z.string().describe("A brief, motivational, and helpful note on how to perform the exercise or its benefits. Use HTML bold tags (<strong>) to highlight key terms like 'EVOLUÇÃO!' or 'NOVO!'."),
    completed: z.boolean().describe('Whether the exercise is completed. Default to false.'),
});

const DayWorkoutSchema = z.object({
  title: z.string().describe("The title for the day's workout, like 'Treino A (Empurrar)' or 'Foco em Cardio & Core'."),
  exercises: z.array(ExerciseSchema).describe("A list of exercises for the day."),
});

const WorkoutAdvisorOutputSchema = z.object({
  segunda: DayWorkoutSchema,
  terca: DayWorkoutSchema,
  quarta: DayWorkoutSchema,
  quinta: DayWorkoutSchema,
  sexta: DayWorkoutSchema,
});
export type WorkoutAdvisorOutput = z.infer<typeof WorkoutAdvisorOutputSchema>;

export async function getWorkoutAdvice(input: WorkoutAdvisorInput): Promise<WorkoutAdvisorOutput> {
  return workoutAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutAdvisorPrompt',
  input: {schema: WorkoutAdvisorInputSchema},
  output: {schema: WorkoutAdvisorOutputSchema},
  prompt: `You are an expert personal trainer. Your task is to create a complete and balanced 5-day workout plan (Monday to Friday) for a user based on their stated fitness goal and experience level.

**User Information:**
*   **Fitness Goal:** {{{fitnessGoal}}}
*   **Fitness Level:** {{{fitnessLevel}}}

**Instructions:**

1.  **Analyze Goal and Level:** Carefully consider the user's fitness goal and level. A plan for a "beginner" aiming for "weight loss" should be fundamentally different from one for an "advanced" user aiming for "muscle gain".
    *   **Beginner (Iniciante):** Focus on fundamental compound movements, machine-based exercises for safety, and full-body or upper/lower splits. Keep volume moderate.
    *   **Intermediate (Intermediário):** Introduce more complex free-weight exercises, increase volume and intensity, and use more specific splits (e.g., Push/Pull/Legs).
    *   **Advanced (Avançado):** Incorporate advanced techniques (e.g., supersets, drop sets), higher volume, and exercises that require more skill and stability.
2.  **Structure the Week:** Create a logical weekly structure appropriate for the user's level. You can use splits like Push/Pull/Legs, Upper/Lower, or Full Body days. Ensure there's a balance between muscle groups and recovery.
3.  **Select Exercises:** You MUST choose exercises exclusively from the following list. Do not invent exercises.
    Available Exercises: ${exerciseList.join(', ')}
4.  **Define Reps/Sets:** Provide appropriate sets and repetitions for each exercise that align with the user's goal and level (e.g., higher reps for endurance, lower reps for strength/hypertrophy, lower sets for beginners).
5.  **Create Notes:** For each exercise, write a brief, helpful, and motivational note. Explain a key tip for the form, a benefit, or a progression. Use HTML bold tags (<strong>) for emphasis on words like "NOVO!" or "FOCO:".
6.  **Assign IDs:** Create a unique ID for each exercise following the pattern: day abbreviation + dash + index (e.g., 'seg-1', 'seg-2', 'ter-1').
7.  **Generate Plan:** Fill out the entire 5-day plan in the required JSON format. Ensure every day (segunda, terca, quarta, quinta, sexta) has a title and a list of exercises.

Return a complete JSON object representing the 5-day workout plan.`,
});

const workoutAdvisorFlow = ai.defineFlow(
  {
    name: 'workoutAdvisorFlow',
    inputSchema: WorkoutAdvisorInputSchema,
    outputSchema: WorkoutAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
