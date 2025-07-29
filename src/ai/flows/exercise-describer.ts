'use server';

/**
 * @fileOverview Exercise describer AI agent.
 *
 * - getExerciseDescription - A function that provides a description for a given exercise.
 * - ExerciseDescriberInput - The input type for the getExerciseDescription function.
 * - ExerciseDescriberOutput - The return type for the getExerciseDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExerciseDescriberInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise.'),
});
export type ExerciseDescriberInput = z.infer<typeof ExerciseDescriberInputSchema>;

const ExerciseDescriberOutputSchema = z.object({
  description: z.string().describe('A description of the exercise, explaining its purpose, targeted muscles, and a quick tip.'),
});
export type ExerciseDescriberOutput = z.infer<typeof ExerciseDescriberOutputSchema>;

export async function getExerciseDescription(input: ExerciseDescriberInput): Promise<ExerciseDescriberOutput> {
  return exerciseDescriberFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exerciseDescriberPrompt',
  input: {schema: ExerciseDescriberInputSchema},
  output: {schema: ExerciseDescriberOutputSchema},
  prompt: `You are a fitness expert. For the exercise "{{exerciseName}}", provide a concise description explaining its main purpose, the primary muscles targeted, and one practical tip for proper execution. Keep the description in Brazilian Portuguese.`,
});

const exerciseDescriberFlow = ai.defineFlow(
  {
    name: 'exerciseDescriberFlow',
    inputSchema: ExerciseDescriberInputSchema,
    outputSchema: ExerciseDescriberOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
