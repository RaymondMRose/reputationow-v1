'use server';

/**
 * @fileOverview An AI agent for generating review titles.
 *
 * - generateReviewTitle - A function that generates a review title based on the review content.
 * - GenerateReviewTitleInput - The input type for the generateReviewTitle function.
 * - GenerateReviewTitleOutput - The return type for the generateReviewTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReviewTitleInputSchema = z.object({
  reviewContent: z
    .string()
    .describe('The content of the review for which a title is to be generated.'),
});
export type GenerateReviewTitleInput = z.infer<typeof GenerateReviewTitleInputSchema>;

const GenerateReviewTitleOutputSchema = z.object({
  suggestedTitle: z.string().describe('The suggested title for the review.'),
});
export type GenerateReviewTitleOutput = z.infer<typeof GenerateReviewTitleOutputSchema>;

export async function generateReviewTitle(input: GenerateReviewTitleInput): Promise<GenerateReviewTitleOutput> {
  return generateReviewTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReviewTitlePrompt',
  input: {schema: GenerateReviewTitleInputSchema},
  output: {schema: GenerateReviewTitleOutputSchema},
  prompt: `You are an AI expert in marketing and writing copy.

You will be provided a user review of a product or service. Your job is to come up with a short, compelling title for the review that will capture the attention of potential customers.

Review content: {{{reviewContent}}}

Suggest a title for the review:`,
});

const generateReviewTitleFlow = ai.defineFlow(
  {
    name: 'generateReviewTitleFlow',
    inputSchema: GenerateReviewTitleInputSchema,
    outputSchema: GenerateReviewTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
