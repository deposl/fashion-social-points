
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Facebook, Instagram, ExternalLink, Youtube } from 'lucide-react';

interface SocialPlatformCardProps {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  icon: React.ReactNode;
  isCompleted: boolean;
  onFollowClick: () => void;
  isLoading: boolean;
}

const platformNames = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const platformColors = {
  facebook: 'bg-blue-600',
  instagram: 'bg-purple-600',
  tiktok: 'bg-gray-900',
  youtube: 'bg-red-600',
};

const platformUrls = {
  facebook: 'https://facebook.com/zada',
  instagram: 'https://instagram.com/zada',
  tiktok: 'https://tiktok.com/zada',
  youtube: 'https://youtube.com/zada',
};

const platformIcons = {
  facebook: <Facebook className="h-5 w-5 md:h-6 md:w-6" />,
  instagram: <Instagram className="h-5 w-5 md:h-6 md:w-6" />,
  tiktok: (
    <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  youtube: <Youtube className="h-5 w-5 md:h-6 md:w-6" />,
};

export function SocialPlatformCard({ 
  platform, 
  icon, 
  isCompleted, 
  onFollowClick, 
  isLoading 
}: SocialPlatformCardProps) {
  const handleVisitPage = () => {
    window.open(platformUrls[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Platform Info */}
        <div className="flex items-center gap-3">
          <div className={`p-2 md:p-3 rounded-full text-white ${platformColors[platform]} flex-shrink-0`}>
            {platformIcons[platform]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base md:text-lg truncate">{platformNames[platform]}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {platform === 'youtube' ? 'Subscribe to our channel' : 'Follow our official page'}
            </p>
          </div>
          {isCompleted && (
            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 md:hidden">
              <Check className="h-3 w-3 mr-1" />
              <span className="text-xs">Done</span>
            </Badge>
          )}
        </div>
        
        {/* Desktop Badge */}
        {isCompleted && (
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 hidden md:flex">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between mt-4">
        <div className="flex items-center gap-1 text-sm text-amber-600">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">25 Points (Rs 25)</span>
        </div>
        
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVisitPage}
            className="flex items-center gap-1 justify-center text-xs md:text-sm"
          >
            <ExternalLink className="h-3 w-3" />
            {platform === 'youtube' ? 'Visit Channel' : 'Visit Page'}
          </Button>
          
          <Button
            onClick={onFollowClick}
            disabled={isCompleted || isLoading}
            className={`${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''} text-xs md:text-sm`}
            size="sm"
          >
            {isLoading ? (
              'Processing...'
            ) : isCompleted ? (
              <>
                <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Earned
              </>
            ) : (
              platform === 'youtube' ? 'Subscribe & Earn' : 'Follow & Earn'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
