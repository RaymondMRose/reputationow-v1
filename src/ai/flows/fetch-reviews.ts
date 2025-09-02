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

// This is a placeholder for a real API call.
const getReviewsFromGoogle = async (businessProfileId: string) => {
  console.log(`Fetching reviews for business ID: ${businessProfileId}`);
  // In a real application, you would make an API call to the Google Business Profile API here.
  // For this example, we'll return mock data.
  return {
    reviews: [
      {
        author: { name: 'John Doe', avatar: 'https://picsum.photos/40/40?random=1' },
        rating: 5,
        content: 'Absolutely fantastic! The service was impeccable and the staff were incredibly friendly. Highly recommend to anyone looking for a great experience.',
        createdAt: '2024-07-21T10:00:00Z',
      },
      {
        author: { name: 'Jane Smith', avatar: 'https://picsum.photos/40/40?random=2' },
        rating: 4,
        content: 'A very pleasant visit. The ambiance was lovely and the product quality was top-notch. I only wish they had more variety. Will be back!',
        createdAt: '2024-07-20T14:30:00Z',
      },
      {
        author: { name: 'Sam Wilson', avatar: 'https://picsum.photos/40/40?random=3' },
        rating: 3,
        content: 'It was an average experience. Nothing particularly stood out, but nothing was bad either. It\'s a reliable option if you\'re in the area.',
        createdAt: '2024-07-19T09:15:00Z',
      },
    ],
  };
};

const fetchGoogleReviewsFlow = ai.defineFlow(
  {
    name: 'fetchGoogleReviewsFlow',
    inputSchema: FetchGoogleReviewsInputSchema,
    outputSchema: FetchGoogleReviewsOutputSchema,
  },
  async (input) => {
    // We are not using an LLM here, just wrapping a data fetch in a flow.
    const googleData = await getReviewsFromGoogle(input.businessProfileId);
    return googleData;
  }
);
