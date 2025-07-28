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

const WorkoutAdvisorInputSchema = z.object({
  workoutPlan: z
    .string()
    .describe('The user workout plan as a JSON string.'),
  fitnessGoal: z.string().describe('The fitness goal of the user.'),
});
export type WorkoutAdvisorInput = z.infer<typeof WorkoutAdvisorInputSchema>;

const WorkoutAdvisorOutputSchema = z.object({
  advice: z.string().describe('Personalized workout advice and exercise modifications.'),
});
export type WorkoutAdvisorOutput = z.infer<typeof WorkoutAdvisorOutputSchema>;

export async function getWorkoutAdvice(input: WorkoutAdvisorInput): Promise<WorkoutAdvisorOutput> {
  return workoutAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'workoutAdvisorPrompt',
  input: {schema: WorkoutAdvisorInputSchema},
  output: {schema: WorkoutAdvisorOutputSchema},
  prompt: `You are a personal workout advisor. Based on the user's workout plan and fitness goal, provide personalized workout advice and exercise modifications to help them optimize their training and achieve better results.

Workout Plan: {{{workoutPlan}}}
Fitness Goal: {{{fitnessGoal}}}

Give concrete advice to achieve the fitness goal.`,
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
