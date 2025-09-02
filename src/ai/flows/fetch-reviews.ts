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
  // For this example, we'll return dynamic mock data.
  
  const mockAuthors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George'];
  const mockContents = [
    'Amazing experience! The staff was friendly and the service was top-notch. I will definitely be coming back.',
    'A truly wonderful place. The atmosphere is cozy and inviting. I had a great time.',
    'Good, but not great. The service was a bit slow, but the quality of the product was excellent.',
    'I had high hopes, but it was just an average experience. Nothing special to report.',
    'Could be better. The location is convenient, but the overall experience was underwhelming.',
    'Fantastic! I would recommend this to all my friends and family. A must-visit!',
    'Decent place. I might come back if I\'m in the area again.',
    'Overpriced for what you get. I was not impressed with the value.',
    'The best I\'ve ever had! I was blown away by the quality. Five stars!',
    'It was okay. I\'ve had better, but I\'ve also had worse. It\'s a safe bet.'
  ];

  const generateRandomReview = (index: number) => {
    const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
    const content = mockContents[Math.floor(Math.random() * mockContents.length)];
    const rating = Math.floor(Math.random() * 3) + 3; // Random rating between 3 and 5
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)); // Random date in the last 30 days
    return {
      author: { name: author, avatar: `https://picsum.photos/40/40?random=${index + 1}` },
      rating,
      content,
      createdAt: date.toISOString(),
    };
  };

  const reviewsCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 reviews
  const reviews = Array.from({ length: reviewsCount }, (_, i) => generateRandomReview(i));

  return { reviews };
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
