'use client';

import React, { useState, useMemo } from 'react';
import { ReviewCard } from './review-card';
import type { Review } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export function ReviewList({ reviews }: ReviewListProps) {
  const [sort, setSort] = useState<SortOption>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];
    if (filterRating !== null) {
      result = result.filter(review => review.rating === filterRating);
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
    }
    return result;
  }, [reviews, sort, filterRating]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-sm font-medium mr-2">Filter by rating:</span>
          <Button
            variant={filterRating === null ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            All
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            <Button
              key={rating}
              variant={filterRating === rating ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(rating)}
              className="flex items-center gap-1"
            >
              {rating} <Star size={14} className="fill-current text-accent" />
            </Button>
          ))}
        </div>
        
        <Select onValueChange={(value) => setSort(value as SortOption)} defaultValue="newest">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest">Highest rating</SelectItem>
            <SelectItem value="lowest">Lowest rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedReviews.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredAndSortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No reviews to display.</p>
          <p className="text-sm text-muted-foreground">Try changing your filters or be the first to leave a review!</p>
        </div>
      )}
    </div>
  );
}
