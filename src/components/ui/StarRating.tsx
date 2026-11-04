import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

const StarRating = ({ 
  rating, 
  max = 5, 
  size = 16, 
  onChange, 
  interactive = false,
  className
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= displayRating;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-all duration-200",
              interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default",
              isActive ? "text-accent fill-accent" : "text-neutral-200"
            )}
          >
            <Star 
              size={size} 
              strokeWidth={isActive ? 0 : 1.5} 
              fill={isActive ? "currentColor" : "none"}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
