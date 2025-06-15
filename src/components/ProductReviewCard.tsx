
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingBag, Star } from 'lucide-react';

export function ProductReviewCard() {
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
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-orange-600">
          <Star className="h-4 w-4" />
          <span className="font-medium">15 Points (Rs 15)</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisitPurchaseHistory}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Purchase History
        </Button>
      </div>
    </div>
  );
}
