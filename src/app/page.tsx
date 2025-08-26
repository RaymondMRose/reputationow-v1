'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { useAuth } from '@/context/auth-context';
import type { Review } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user, loading } = useAuth();

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

          {loading ? (
            <div className="w-full h-48 bg-card border rounded-lg animate-pulse" />
          ) : (
            user && <ReviewForm onReviewSubmit={handleReviewSubmit} />
          )}

          <Separator />
          
          <section>
            <h2 className="text-2xl font-bold mb-4">All Reviews ({reviews.length})</h2>
            <ReviewList reviews={reviews} />
          </section>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t mt-8">
        <p>&copy; {new Date().getFullYear()} Review Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
