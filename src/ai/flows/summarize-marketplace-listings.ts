'use server';
/**
 * @fileOverview Summarizes marketplace listings based on a search query.
 *
 * - summarizeMarketplaceListings - A function that summarizes marketplace listings.
 * - SummarizeMarketplaceListingsInput - The input type for the summarizeMarketplaceListings function.
 * - SummarizeMarketplaceListingsOutput - The return type for the summarizeMarketplaceListings function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeMarketplaceListingsInputSchema = z.object({
  query: z.string().describe('The search query to use to find marketplace listings.'),
  listings: z.array(z.string()).describe('The marketplace listings to summarize.'),
});
export type SummarizeMarketplaceListingsInput = z.infer<
  typeof SummarizeMarketplaceListingsInputSchema
>;

const SummarizeMarketplaceListingsOutputSchema = z.object({
  summary: z.string().describe('A summary of the marketplace listings.'),
});
export type SummarizeMarketplaceListingsOutput = z.infer<
  typeof SummarizeMarketplaceListingsOutputSchema
>;

export async function summarizeMarketplaceListings(
  input: SummarizeMarketplaceListingsInput
): Promise<SummarizeMarketplaceListingsOutput> {
  return summarizeMarketplaceListingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketplaceListingsPrompt',
  input: {
    schema: z.object({
      query: z.string().describe('The search query to use to find marketplace listings.'),
      listings: z.array(z.string()).describe('The marketplace listings to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the marketplace listings.'),
    }),
  },
  prompt: `You are an AI assistant helping users find what they need in a marketplace.

  The user is looking for: {{{query}}}
  Here are the marketplace listings:
  {{#each listings}}
  - {{{this}}}
  {{/each}}

  Please summarize the marketplace listings so the user can quickly understand the key offerings and find what they need.
  `,
});

const summarizeMarketplaceListingsFlow = ai.defineFlow<
  typeof SummarizeMarketplaceListingsInputSchema,
  typeof SummarizeMarketplaceListingsOutputSchema
>(
  {
    name: 'summarizeMarketplaceListingsFlow',
    inputSchema: SummarizeMarketplaceListingsInputSchema,
    outputSchema: SummarizeMarketplaceListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
