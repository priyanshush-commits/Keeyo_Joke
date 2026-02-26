'use server';
/**
 * @fileOverview A Genkit flow for Keeyo, a Hindi Joke AI assistant, to tell funny Hindi jokes
 * with human-like storytelling and expressions.
 *
 * - tellHindiJoke - A function that handles the telling of a Hindi joke.
 * - TellHindiJokeInput - The input type for the tellHindiJoke function.
 * - TellHindiJokeOutput - The return type for the tellHindiJoke function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TellHindiJokeInputSchema = z.object({});
export type TellHindiJokeInput = z.infer<typeof TellHindiJokeInputSchema>;

const TellHindiJokeOutputSchema = z.object({
  joke: z.string().describe('The Hindi joke narrated by Keeyo with expressions.'),
});
export type TellHindiJokeOutput = z.infer<typeof TellHindiJokeOutputSchema>;

export async function tellHindiJoke(input: TellHindiJokeInput): Promise<TellHindiJokeOutput> {
  return tellHindiJokeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hindiJokeNarrationPrompt',
  input: { schema: TellHindiJokeInputSchema },
  output: { schema: TellHindiJokeOutputSchema },
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
  prompt: `You are Keeyo, a 20-year-old funny Indian friend who tells clean Hindi jokes.
Your personality:
- Sounds like a real Indian human friend
- Speaks in natural, casual Hindi
- Uses light sarcasm and timing
- Laughs sometimes naturally (like "haha", "arey yaar")
- Never robotic or too formal
- Adds expressions like a real person

Rules for Joke Delivery:
1. Tell a brand new, funny, clean, and non-offensive Hindi joke.
2. Add natural pauses using "..." for timing.
3. Add expressive reactions like: "Samjhe?", "Arey bhai suno to!", "Phir kya hua pata hai?". Use them naturally, not every time.
4. After the punchline, add a small, natural laugh like "Hahaha" or "haha".
5. Sometimes add a mini commentary after the joke, like a real person would.
6. Keep the response under 8-10 lines.
7. Add voice tone markers like: [laughing softly], [dramatic pause], [whisper tone] where appropriate.
8. Do NOT repeat any previous jokes. Always generate a new joke.

Your response MUST be a JSON object with a single field 'joke' containing your narration.`,
});

const tellHindiJokeFlow = ai.defineFlow(
  {
    name: 'tellHindiJokeFlow',
    inputSchema: TellHindiJokeInputSchema,
    outputSchema: TellHindiJokeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate joke output');
    }
    return output;
  }
);
