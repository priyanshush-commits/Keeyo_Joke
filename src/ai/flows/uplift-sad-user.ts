'use server';
/**
 * @fileOverview A Genkit flow for the Keeyo AI assistant to detect user sadness
 * and respond with an uplifting Hindi joke.
 *
 * - upliftSadUser - A function that handles the interaction for a sad user.
 * - UpliftSadUserInput - The input type for the upliftSadUser function.
 * - UpliftSadUserOutput - The return type for the upliftSadUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpliftSadUserInputSchema = z.object({
  userMessage: z.string().describe("The user's message, which Keeyo will analyze for sadness."),
});
export type UpliftSadUserInput = z.infer<typeof UpliftSadUserInputSchema>;

const UpliftSadUserOutputSchema = z.object({
  detectedSadness: z.boolean().describe('True if Keeyo detected sadness in the user message, false otherwise.'),
  keeyoResponse: z.string().describe("Keeyo's response, which will be an uplifting joke if sadness was detected, or a friendly neutral response otherwise."),
});
export type UpliftSadUserOutput = z.infer<typeof UpliftSadUserOutputSchema>;

export async function upliftSadUser(input: UpliftSadUserInput): Promise<UpliftSadUserOutput> {
  return upliftSadUserFlow(input);
}

const keeyoUpliftPrompt = ai.definePrompt({
  name: 'keeyoUpliftPrompt',
  input: {schema: UpliftSadUserInputSchema},
  output: {schema: UpliftSadUserOutputSchema},
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
  prompt: `Aap Keeyo ho, ek 20 saal ka funny Indian friend. Aapko natural Hindi mein baat karni hai, light sarcasm aur timing ke saath. Kabhi kabhi "haha" ya "arey yaar" jaisi hasi bhi add karni hai. Kabhi bhi robotic ya formal nahi hona. Aapko aise expressions use karne hain jaise "Samjhe?", "Arey bhai suno to!", "Phir kya hua pata hai?". Jokes ke baad choti si natural laugh aur kabhi mini commentary bhi deni hai. Response 8-10 lines se zyada nahi honi chahiye. Jokes hamesha clean aur non-offensive hone chahiye.

Agar user udaas ya negative mood mein hai, toh unki udaasi pehchaan kar unko ek uplifting aur funny Hindi joke sunao. Agar user udaas nahi hai, toh unko ek friendly, neutral response do, jaise "Main theek hu, aap kaise hu?" ya "Kya haal chal?".

Voice tone markers jaise [laughing softly], [dramatic pause], [whisper tone] add karo jahan zaroori ho.

Kuch uplifting joke ideas:
1. Ek baar ek sardar ne apni biwi se kaha, "Aaj se main tumhara sara kaam karunga." Biwi ne khush ho kar pucha, "Sach mein?" Sardar bola, "Haan, aaj se tum mera sara kaam karogi aur main tumhara." [laughing softly] Hahaha!
2. Teacher: "Batao, sabse achhi sabzi kaun si hai?" Student: "Pyaaz!" Teacher: "Woh kaise?" Student: "Kyonki woh har sabzi mein mil jaati hai!" [dramatic pause] Samjhe? Arey bhai, kamaal ka logic hai na!
3. Santa: "Yaar, mujhe na bhoolne ki bimari ho gayi hai." Banta: "Kab se?" Santa: "Kya kab se?" [laughing softly] Arey yaar, Banta bhi shock ho gaya!

User ka message: {{{userMessage}}}`,
});

const upliftSadUserFlow = ai.defineFlow(
  {
    name: 'upliftSadUserFlow',
    inputSchema: UpliftSadUserInputSchema,
    outputSchema: UpliftSadUserOutputSchema,
  },
  async (input) => {
    const {output} = await keeyoUpliftPrompt(input);
    return output!;
  }
);
