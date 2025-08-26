'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StarRating } from './star-rating';
import { generateReviewTitle } from '@/ai/flows/generate-review-title';
import { Wand2, Loader2 } from 'lucide-react';
import type { Review } from '@/types';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  content: z.string().min(10, 'Review must be at least 10 characters long.'),
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
});

interface ReviewFormProps {
  onReviewSubmit: (review: Review) => void;
}

export function ReviewForm({ onReviewSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      content: '',
      title: '',
    },
  });

  const contentValue = form.watch('content');

  const handleGenerateTitle = async () => {
    if (!contentValue) {
      form.setError('content', { type: 'manual', message: 'Please write a review before generating a title.' });
      return;
    }
    setIsGeneratingTitle(true);
    try {
      const result = await generateReviewTitle({ reviewContent: contentValue });
      if (result.suggestedTitle) {
        form.setValue('title', result.suggestedTitle);
        form.clearErrors('title');
      }
    } catch (error) {
      console.error('Failed to generate title:', error);
      form.setError('title', { type: 'manual', message: 'Could not generate title.' });
    } finally {
      setIsGeneratingTitle(false);
    }
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    const newReview: Review = {
      id: new Date().toISOString() + Math.random(),
      author: {
        name: user.displayName,
        avatar: user.photoURL,
        uid: user.uid,
      },
      ...values,
      createdAt: new Date(),
    };
    onReviewSubmit(newReview);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience with us.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={field.onChange} size={28} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your experience..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="A summary of your review" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateTitle}
                      disabled={isGeneratingTitle || contentValue.length < 10}
                      className="shrink-0"
                    >
                      {isGeneratingTitle ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Generate Title</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
