import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from './star-rating';
import { formatDistanceToNow } from 'date-fns';
import type { Review } from '@/types';
import { User } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="break-inside-avoid">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <Avatar>
          <AvatarImage src={review.author.avatar || ''} alt={review.author.name || 'User'} data-ai-hint="avatar" />
          <AvatarFallback>
            {review.author.name ? review.author.name.charAt(0).toUpperCase() : <User />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{review.author.name || 'Anonymous'}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(review.createdAt, { addSuffix: true })}
            </p>
          </div>
          <StarRating rating={review.rating} size={16} />
        </div>
      </CardHeader>
      <CardContent>
        {review.title && <h3 className="font-semibold text-lg mb-2">{review.title}</h3>}
        <p className="text-muted-foreground whitespace-pre-wrap">{review.content}</p>
      </CardContent>
    </Card>
  );
}
