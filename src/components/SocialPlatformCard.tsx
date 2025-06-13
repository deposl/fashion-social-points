
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Facebook, Instagram } from 'lucide-react';

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
  instagram: 'bg-purple-600',
  tiktok: 'bg-gray-900',
};

const platformIcons = {
  facebook: <Facebook className="h-6 w-6" />,
  instagram: <Instagram className="h-6 w-6" />,
  tiktok: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
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
            {platformIcons[platform]}
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
