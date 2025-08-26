'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  className?: string;
  size?: number;
}

export function StarRating({ rating, onRatingChange, className, size = 24 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (onRatingChange) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (onRatingChange) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index);
    }
  };

  const isInteractive = !!onRatingChange;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const currentRating = hoverRating || rating;
        const isFilled = index <= currentRating;
        
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'transition-colors',
              isFilled ? 'text-accent fill-accent' : 'text-muted-foreground/50',
              isInteractive && 'cursor-pointer hover:text-accent'
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            aria-label={`Rate ${index} out of 5 stars`}
          />
        );
      })}
    </div>
  );
}
