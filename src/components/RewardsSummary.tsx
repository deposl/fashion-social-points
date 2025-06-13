
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Gift } from 'lucide-react';
import { RewardHistory } from '@/hooks/useRewards';

interface RewardsSummaryProps {
  totalPoints: number;
  rewardHistory: RewardHistory[];
}

export function RewardsSummary({ totalPoints, rewardHistory }: RewardsSummaryProps) {
  const totalValue = totalPoints; // 1 point = Rs 1

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Star className="h-5 w-5 text-amber-600 fill-current" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold text-amber-700">{totalPoints}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-green-700">Rs {totalValue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
              <p className="text-2xl font-bold text-blue-700">{rewardHistory.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rewards History */}
      {rewardHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Rewards History
          </h3>
          <div className="space-y-3">
            {rewardHistory.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {reward.platform}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Followed official page
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+{reward.points} points</p>
                  <p className="text-xs text-muted-foreground">
                    Rs {reward.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
