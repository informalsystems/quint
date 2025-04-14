'use server';
/**
 * @fileOverview An AI agent that suggests potential trade partners based on user needs and network activity.
 *
 * - suggestTradePartners - A function that handles the trade partner suggestion process.
 * - SuggestTradePartnersInput - The input type for the suggestTradePartners function.
 * - SuggestTradePartnersOutput - The return type for the suggestTradePartners function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTradePartnersInputSchema = z.object({
  userNeeds: z.string().describe('The user needs or requirements for a trade.'),
  networkActivity: z.string().describe('The recent network activity of the user.'),
});
export type SuggestTradePartnersInput = z.infer<typeof SuggestTradePartnersInputSchema>;

const SuggestTradePartnersOutputSchema = z.object({
  tradeSuggestions: z
    .array(z.string())
    .describe('A list of potential trade partners and opportunities.'),
});
export type SuggestTradePartnersOutput = z.infer<typeof SuggestTradePartnersOutputSchema>;

export async function suggestTradePartners(input: SuggestTradePartnersInput): Promise<SuggestTradePartnersOutput> {
  return suggestTradePartnersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTradePartnersPrompt',
  input: {
    schema: z.object({
      userNeeds: z.string().describe('The user needs or requirements for a trade.'),
      networkActivity: z.string().describe('The recent network activity of the user.'),
    }),
  },
  output: {
    schema: z.object({
      tradeSuggestions: z
        .array(z.string())
        .describe('A list of potential trade partners and opportunities.'),
    }),
  },
  prompt: `You are an AI trade assistant specializing in suggesting trade partners within the Sardex network.

  Based on the user's needs and their recent network activity, suggest potential trade partners and opportunities.

  User Needs: {{{userNeeds}}}
  Network Activity: {{{networkActivity}}}

  Trade Suggestions:`, // Ensure the LLM provides a valid JSON array of strings.
});

const suggestTradePartnersFlow = ai.defineFlow<
  typeof SuggestTradePartnersInputSchema,
  typeof SuggestTradePartnersOutputSchema
>(
  {
    name: 'suggestTradePartnersFlow',
    inputSchema: SuggestTradePartnersInputSchema,
    outputSchema: SuggestTradePartnersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
