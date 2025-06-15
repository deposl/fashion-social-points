
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ExternalLink, ShoppingBag } from 'lucide-react';

interface ProductReviewCardProps {
  isCompleted: boolean;
  onReviewClick: () => void;
  isLoading: boolean;
}

export function ProductReviewCard({ 
  isCompleted, 
  onReviewClick, 
  isLoading 
}: ProductReviewCardProps) {
  const handleVisitPurchaseHistory = () => {
    window.open('https://www.zada.lk/purchase_history', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full text-white bg-orange-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Product Review</h3>
            <p className="text-sm text-muted-foreground">
              Purchase and review products to earn rewards
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-amber-600">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">15 Points (Rs 15)</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVisitPurchaseHistory}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Purchase History
          </Button>
          
          <Button
            onClick={onReviewClick}
            disabled={isCompleted || isLoading}
            className={`${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {isLoading ? (
              'Processing...'
            ) : isCompleted ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Earned
              </>
            ) : (
              'Review & Earn'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
