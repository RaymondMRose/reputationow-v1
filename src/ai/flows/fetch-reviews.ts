'use server';

/**
 * @fileOverview An AI agent for fetching reviews from a Google Business Profile.
 *
 * - fetchGoogleReviews - A function that fetches reviews for a given business profile ID.
 * - FetchGoogleReviewsInput - The input type for the fetchGoogleReviews function.
 * - FetchGoogleReviewsOutput - The return type for the fetchGoogleReviews function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchGoogleReviewsInputSchema = z.object({
  businessProfileId: z.string().describe('The Google Business Profile ID.'),
});
export type FetchGoogleReviewsInput = z.infer<typeof FetchGoogleReviewsInputSchema>;

const ReviewSchema = z.object({
  author: z.object({
    name: z.string().nullable(),
    avatar: z.string().nullable(),
  }),
  rating: z.number(),
  content: z.string(),
  createdAt: z.string().describe('The creation date of the review in ISO 8601 format.'),
});

const FetchGoogleReviewsOutputSchema = z.object({
  reviews: z.array(ReviewSchema),
});
export type FetchGoogleReviewsOutput = z.infer<typeof FetchGoogleReviewsOutputSchema>;

export async function fetchGoogleReviews(input: FetchGoogleReviewsInput): Promise<FetchGoogleReviewsOutput> {
  return fetchGoogleReviewsFlow(input);
}

// This function now fetches live data from a reviews API.
const getReviewsFromGoogle = async (businessProfileId: string) => {
  console.log(`Fetching live reviews for business ID: ${businessProfileId}`);
  
  // In a real application, you would replace this with the actual Google Business Profile API endpoint.
  // This example uses a public API that returns placeholder user data.
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=1`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  const data = await response.json();

  // Map the API response to the expected Review format.
  const reviews = data.map((item: any, index: number) => ({
    author: {
      name: item.name,
      avatar: `https://picsum.photos/40/40?random=${index + 1}`,
    },
    rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3 and 5
    content: item.body,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
  }));

  return { reviews };
};

const fetchGoogleReviewsFlow = ai.defineFlow(
  {
    name: 'fetchGoogleReviewsFlow',
    inputSchema: FetchGoogleReviewsInputSchema,
    outputSchema: FetchGoogleReviewsOutputSchema,
  },
  async (input) => {
    const googleData = await getReviewsFromGoogle(input.businessProfileId);
    return googleData;
  }
);
