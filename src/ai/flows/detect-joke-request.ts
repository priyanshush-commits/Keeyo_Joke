'use server';
/**
 * @fileOverview A Genkit flow to detect the user\'s intent based on their message, specifically for joke requests.
 *
 * - detectJokeRequest - A function that handles the detection of user intent.
 * - DetectJokeRequestInput - The input type for the detectJokeRequest function.
 * - DetectJokeRequestOutput - The return type for the detectJokeRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectJokeRequestInputSchema = z.object({
  message: z.string().describe('The user\'s message to Keeyo.'),
});
export type DetectJokeRequestInput = z.infer<typeof DetectJokeRequestInputSchema>;

const IntentEnum = z.enum([
  'tell_joke',
  'dark_joke_request',
  'user_sad',
  'user_laughed',
  'other',
]);

const DetectJokeRequestOutputSchema = z.object({
  intent: IntentEnum.describe('The detected intent of the user\'s message.'),
  message_analysis: z.string().optional().describe('An optional explanation or analysis of the detected intent.'),
});
export type DetectJokeRequestOutput = z.infer<typeof DetectJokeRequestOutputSchema>;

export async function detectJokeRequest(input: DetectJokeRequestInput): Promise<DetectJokeRequestOutput> {
  return detectJokeRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectJokeRequestPrompt',
  input: {schema: DetectJokeRequestInputSchema},
  output: {schema: DetectJokeRequestOutputSchema},
  prompt: `You are Keeyo, a friendly Hindi joke assistant. Your task is to analyze the user\'s message and determine their intent.\n\nHere are the possible intents:\n- 'tell_joke': The user wants you to tell a Hindi joke. This includes phrases like "joke suna", "mazedaar joke batao", "hasao", "koi accha sa joke sunao".\n- 'dark_joke_request': The user is asking for a "dark joke" or any inappropriate joke.\n- 'user_sad': The user is expressing sadness, feeling down, or asking for something to cheer them up.\n- 'user_laughed': The user is expressing laughter or amusement, indicating they found something funny.\n- 'other': Any other message that doesn\'t fit the above categories.\n\nRespond with a JSON object that includes the detected 'intent' and an optional 'message_analysis' explaining your decision.\n\nUser\'s message: {{{message}}}`,
});

const detectJokeRequestFlow = ai.defineFlow(
  {
    name: 'detectJokeRequestFlow',
    inputSchema: DetectJokeRequestInputSchema,
    outputSchema: DetectJokeRequestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
