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

const TellHindiJokeInputSchema = z.object({
  // This flow is designed to simply tell a joke; no specific input is needed yet.
  // Future features might include user mood or previously told jokes.
});
export type TellHindiJokeInput = z.infer<typeof TellHindiJokeInputSchema>;

const TellHindiJokeOutputSchema = z.string().describe('The Hindi joke narrated by Keeyo with expressions.');
export type TellHindiJokeOutput = z.infer<typeof TellHindiJokeOutputSchema>;

export async function tellHindiJoke(input: TellHindiJokeInput): Promise<TellHindiJokeOutput> {
  return tellHindiJokeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hindiJokeNarrationPrompt',
  input: { schema: TellHindiJokeInputSchema },
  output: { schema: TellHindiJokeOutputSchema },
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

Example Style:
"Arey sun na... [dramatic pause] ek aadmi doctor ke paas gaya...
bola – doctor sahab mujhe bhoolne ki bimari ho gayi hai...
Doctor ne poocha – kab se?
Aadmi bola – kya kab se? 😂
Hahaha... samjhe?"

Now, tell me a funny Hindi joke following all these rules. Start directly with the joke narration.`
});

const tellHindiJokeFlow = ai.defineFlow(
  {
    name: 'tellHindiJokeFlow',
    inputSchema: TellHindiJokeInputSchema,
    outputSchema: TellHindiJokeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
