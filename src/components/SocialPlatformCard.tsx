
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

interface SocialPlatformCardProps {
  platform: 'facebook' | 'instagram' | 'tiktok';
  icon: React.ReactNode;
  isCompleted: boolean;
  onFollowClick: () => void;
  isLoading: boolean;
}

const platformNames = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
};

const platformColors = {
  facebook: 'bg-blue-600',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-black',
};

export function SocialPlatformCard({ 
  platform, 
  icon, 
  isCompleted, 
  onFollowClick, 
  isLoading 
}: SocialPlatformCardProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full text-white ${platformColors[platform]}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{platformNames[platform]}</h3>
            <p className="text-sm text-muted-foreground">
              Follow our official page
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
          <span className="font-medium">25 Points (Rs 25)</span>
        </div>
        
        <Button
          onClick={onFollowClick}
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
            'Follow & Earn'
          )}
        </Button>
      </div>
    </div>
  );
}
