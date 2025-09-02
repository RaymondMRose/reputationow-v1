'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { useAuth } from '@/context/auth-context';
import type { Review } from '@/types';
import { Separator } from '@/components/ui/separator';
import { fetchGoogleReviews } from '@/ai/flows/fetch-reviews';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_ID) {
        console.error('Google Business ID is not set in environment variables.');
        setReviewsLoading(false);
        return;
      }
      try {
        setReviewsLoading(true);
        const remoteReviews = await fetchGoogleReviews({
          businessProfileId: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_ID,
        });

        const formattedReviews: Review[] = remoteReviews.reviews.map((r, index) => ({
          id: `google-${index}-${new Date(r.createdAt).getTime()}`,
          author: {
            name: r.author.name,
            avatar: r.author.avatar,
            uid: `google-user-${index}`,
          },
          rating: r.rating,
          title: '', // Google reviews don't have titles
          content: r.content,
          createdAt: new Date(r.createdAt),
        }));

        setReviews(prevReviews => [...formattedReviews, ...prevReviews]);
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, []);


  const handleReviewSubmit = (review: Review) => {
    setReviews(prevReviews => [review, ...prevReviews]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          <section className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Share Your Experience</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Help others by leaving a review. Sign in to get started.
            </p>
          </section>

          {authLoading ? (
            <div className="w-full h-48 bg-card border rounded-lg animate-pulse" />
          ) : (
            user && <ReviewForm onReviewSubmit={handleReviewSubmit} />
          )}

          <Separator />
          
          <section>
            <h2 className="text-2xl font-bold mb-4">All Reviews ({reviews.length})</h2>
            {reviewsLoading ? (
               <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="break-inside-avoid space-y-4 p-4 border rounded-lg">
                     <div className="flex items-center gap-4">
                       <Skeleton className="h-10 w-10 rounded-full" />
                       <div className="space-y-2 flex-1">
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-4 w-1/2" />
                       </div>
                     </div>
                     <Skeleton className="h-4 w-4/5" />
                     <Skeleton className="h-16 w-full" />
                   </div>
                 ))}
               </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </section>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t mt-8">
        <p>&copy; {new Date().getFullYear()} Review Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
