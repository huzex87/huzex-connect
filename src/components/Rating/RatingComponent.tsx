import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RatingComponentProps {
  orderId: string;
  riderId: string;
  onRatingSubmitted?: () => void;
  existingRating?: {
    rating: number;
    comment: string;
  };
}

export const RatingComponent: React.FC<RatingComponentProps> = ({
  orderId,
  riderId,
  onRatingSubmitted,
  existingRating
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) {
      toast({
        title: "Invalid rating",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const ratingData = {
        order_id: orderId,
        customer_id: user.id,
        rider_id: riderId,
        rating,
        comment: comment.trim() || null,
      };

      let error;

      if (existingRating) {
        // Update existing rating
        const { error: updateError } = await supabase
          .from('ratings')
          .update({
            rating,
            comment: comment.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('order_id', orderId)
          .eq('customer_id', user.id);
        
        error = updateError;
      } else {
        // Create new rating
        const { error: insertError } = await supabase
          .from('ratings')
          .insert(ratingData);
        
        error = insertError;
      }

      if (error) {
        console.error('Rating error:', error);
        toast({
          title: "Rating failed",
          description: error.message || "Failed to submit rating",
          variant: "destructive",
        });
        return;
      }

      // Update rider's average rating
      const { data: allRatings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('rider_id', riderId);

      if (allRatings && allRatings.length > 0) {
        const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        
        await supabase
          .from('riders')
          .update({ rating: Number(avgRating.toFixed(1)) })
          .eq('id', riderId);
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });

      onRatingSubmitted?.();

    } catch (error) {
      console.error('Rating submission error:', error);
      toast({
        title: "Rating failed",
        description: "An error occurred while submitting your rating",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <CardDescription>
          Help us improve by rating your delivery experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="p-1 hover:scale-110 transition-transform"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {rating > 0 && (
            <span>
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </span>
          )}
        </div>

        <Textarea
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || submitting}
          className="w-full"
        >
          {submitting ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
        </Button>
      </CardContent>
    </Card>
  );
};