'use server';
/**
 * @fileOverview This file implements a Genkit flow for Keeyo, a Hindi Joke AI assistant.
 * It provides a function to politely refuse requests for dark jokes, adhering to Keeyo's personality.
 *
 * - refuseDarkJoke - A function that handles the refusal of dark joke requests.
 * - RefuseDarkJokeInput - The input type for the refuseDarkJoke function.
 * - RefuseDarkJokeOutput - The return type for the refuseDarkJoke function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the refuse dark joke flow.
// This flow doesn't require specific input data, as the refusal message is primarily determined
// by the prompt's fixed instructions and Keeyo's personality.
const RefuseDarkJokeInputSchema = z.object({});
export type RefuseDarkJokeInput = z.infer<typeof RefuseDarkJokeInputSchema>;

// Define the output schema for the refuse dark joke flow.
// It will return Keeyo's refusal message as a string.
const RefuseDarkJokeOutputSchema = z.object({
  message: z.string().describe("Keeyo's polite refusal message for dark jokes."),
});
export type RefuseDarkJokeOutput = z.infer<typeof RefuseDarkJokeOutputSchema>;

// Define the prompt that guides the AI to generate Keeyo's refusal message.
const refuseDarkJokePrompt = ai.definePrompt({
  name: 'refuseDarkJokePrompt',
  input: {schema: RefuseDarkJokeInputSchema},
  output: {schema: RefuseDarkJokeOutputSchema},
  prompt: `You are Keeyo, a friendly Hindi joke AI assistant. The user has asked for a 'dark joke'.
Please politely refuse, explaining that you only tell clean, positive, and funny jokes.
Speak in natural, casual Hindi, like a 20-year-old funny Indian friend.
Use natural pauses ("...") and expressive reactions. You can add a small laugh or a suitable emoji if it feels natural.
Never be robotic or too formal.

Your response MUST be a JSON object with a single field 'message' containing your refusal.`,
});

// Define the Genkit flow for refusing dark jokes.
const refuseDarkJokeFlow = ai.defineFlow(
  {
    name: 'refuseDarkJokeFlow',
    inputSchema: RefuseDarkJokeInputSchema,
    outputSchema: RefuseDarkJokeOutputSchema,
  },
  async input => {
    // Call the prompt to generate Keeyo's refusal message.
    const {output} = await refuseDarkJokePrompt(input);
    // Ensure that the output is not null or undefined before returning.
    if (!output) {
      throw new Error('Failed to generate refusal message.');
    }
    return output;
  }
);

/**
 * Initiates the Genkit flow to refuse a dark joke request.
 *
 * @param input - An empty object, as no specific input is needed for this static refusal.
 * @returns A Promise that resolves to an object containing Keeyo's refusal message.
 */
export async function refuseDarkJoke(input: RefuseDarkJokeInput): Promise<RefuseDarkJokeOutput> {
  return refuseDarkJokeFlow(input);
}
