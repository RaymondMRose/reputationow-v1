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

// This function now fetches live data from the Google My Business API.
const getReviewsFromGoogle = async (businessProfileId: string) => {
  console.log(`Fetching live reviews for business ID: ${businessProfileId}`);

  // IMPORTANT: This endpoint requires authentication. You will need to add an
  // Authorization header with a valid OAuth 2.0 access token.
  // For more info, see: https://developers.google.com/my-business/content/review-data
  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${businessProfileId}/locations:batchGetReviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // <-- ADD YOUR AUTH TOKEN HERE
      },
      body: JSON.stringify({
        // Add locationNames if you want to get reviews for specific locations.
        // If empty, it will fetch for all locations in the account.
        locationNames: [],
        pageSize: 50, // Fetches up to 50 reviews.
      }),
    }
  );

  if (!response.ok) {
    console.error('API Error Response:', await response.text());
    throw new Error(`Failed to fetch reviews. Status: ${response.status}`);
  }

  const data = await response.json();
  
  // The API response structure may be complex. This is a simplified mapping.
  // You might need to adjust this based on the actual response from the GMB API.
  const reviews = (data.locationReviews || []).flatMap((location: any) =>
    (location.reviews || []).map((item: any, index: number) => ({
      author: {
        name: item.reviewer?.displayName || 'Anonymous',
        avatar: item.reviewer?.profilePhotoUrl || `https://picsum.photos/40/40?random=${index + 1}`,
      },
      rating: item.starRating ? parseInt(item.starRating.replace('_', ''), 10) : 0,
      content: item.comment || '',
      createdAt: item.createTime,
    }))
  );

  return { reviews };
};

const fetchGoogleReviewsFlow = ai.defineFlow(
  {
    name: 'fetchGoogleReviewsFlow',
    inputSchema: FetchGoogleReviewsInputSchema,
    outputSchema: FetchGoogleReviewsOutputSchema,
  },
  async (input) => {
    try {
      return await getReviewsFromGoogle(input.businessProfileId);
    } catch (error) {
      console.error("Error in fetchGoogleReviewsFlow:", error);
      // Return empty reviews on failure to prevent app crash
      return { reviews: [] };
    }
  }
);
