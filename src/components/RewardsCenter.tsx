
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SocialPlatformCard } from './SocialPlatformCard';
import { UploadModal } from './UploadModal';
import { RewardsSummary } from './RewardsSummary';
import { RewardsHeader } from './RewardsHeader';
import { useRewards } from '@/hooks/useRewards';
import { checkLoginStatus, openAuthPopup, logout } from '@/utils/auth';
import { 
  verifyFacebookFollow, 
  verifyInstagramFollow, 
  verifyTikTokFollow,
  verifyYouTubeFollow,
  checkUserStatus
} from '@/services/rewardsApi';
import { uploadImageToSupabase } from '@/utils/supabase';
import { User } from 'lucide-react';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { checkUserPhone } from '@/services/phoneApi';
import { ProductReviewCard } from './ProductReviewCard';

interface User {
  name: string;
  email: string;
}

export function RewardsCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'instagram' | 'tiktok' | 'youtube' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  
  const { rewardStatus, rewardHistory, totalPoints, markRewardClaimed, initializeFromAPI, resetRewards, loadRewardData } = useRewards();
  const { toast } = useToast();

  // Always check user status fresh on mount and user change
  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      // Always check fresh status when user is available
      checkUserFollowStatus();
      checkUserPhoneStatus();
    } else {
      // Load local data when no user
      loadRewardData();
    }
  }, [user]);

  const checkUserLoginStatus = async () => {
    setIsAuthLoading(true);
    try {
      const loggedInUser = await checkLoginStatus();
      setUser(loggedInUser);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const checkUserFollowStatus = async () => {
    if (!user) return;
    
    setIsCheckingStatus(true);
    const userId = 10; // You would get this from your user object
    
    try {
      console.log('Checking user follow status...');
      const statusResponse = await checkUserStatus(userId);
      console.log('Status response:', statusResponse);

      // Always reset and set fresh data
      if (statusResponse && statusResponse.length > 0) {
        if (statusResponse.length === 1 && Object.keys(statusResponse[0]).length === 0) {
          console.log('User has not followed any pages');
          // Clear any cached status
          resetRewards();
          return;
        }

        const followedPlatforms = statusResponse
          .map(status => status.action_type)
          .filter(actionType => actionType && typeof actionType === 'string');

        console.log('Followed platforms:', followedPlatforms);

        if (followedPlatforms.length > 0) {
          // Always initialize from fresh API data
          initializeFromAPI(followedPlatforms);
        } else {
          // Clear if no platforms followed
          resetRewards();
        }
      } else {
        console.log('No follow status found for user');
        // Clear any cached status
        resetRewards();
      }

    } catch (error) {
      console.error('Error checking user follow status:', error);
      // Load local data as fallback but don't cache the error
      loadRewardData();
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const checkUserPhoneStatus = async () => {
    if (!user) return;
    
    try {
      const userId = 10; // You would get this from your user object
      const phoneStatus = await checkUserPhone(userId);
      
      if (phoneStatus.phone_number === 'not-found') {
        // Show phone verification modal after a short delay
        setTimeout(() => {
          setPhoneModalOpen(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking phone status:', error);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const loggedInUser = await openAuthPopup();
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({
          title: 'Login successful!',
          description: `Welcome ${loggedInUser.name}! You can now earn rewards.`,
        });
        // Status will be checked via useEffect when user changes
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    resetRewards();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleFollowClick = (platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube') => {
    if (!user) {
      handleLogin();
      return;
    }

    if (rewardStatus[platform]) {
      toast({
        title: 'Already earned',
        description: `You have already earned rewards for ${platform}.`,
      });
      return;
    }

    setSelectedPlatform(platform);
    setUploadModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !selectedPlatform) return;

    setIsLoading(true);
    try {
      const imageUrl = await uploadImageToSupabase(file);
      console.log("Uploaded image URL:", imageUrl);
      
      const requestData = {
        user_id: 10,
        image_url: imageUrl,
      };

      let response;
      switch (selectedPlatform) {
        case 'facebook':
          response = await verifyFacebookFollow(requestData);
          break;
        case 'instagram':
          response = await verifyInstagramFollow(requestData);
          break;
        case 'tiktok':
          response = await verifyTikTokFollow(requestData);
          break;
        case 'youtube':
          response = await verifyYouTubeFollow(requestData);
          break;
      }

      console.log('Verification response:', response);

      const isSuccess = 
        (selectedPlatform === 'facebook' && response.facebook_page === 'liked') ||
        (selectedPlatform === 'instagram' && response.instagram_page === 'followed') ||
        (selectedPlatform === 'tiktok' && response.tiktok_page === 'followed') ||
        (selectedPlatform === 'youtube' && response.youtube_page === 'followed');

      if (isSuccess) {
        markRewardClaimed(selectedPlatform);
        const actionText = selectedPlatform === 'youtube' ? 'subscribing to' : 'following';
        toast({
          title: 'Congratulations! 🎉',
          description: `You've earned 25 points (Rs 25) for ${actionText} our ${selectedPlatform} ${selectedPlatform === 'youtube' ? 'channel' : 'page'}!`,
        });
      } else {
        const actionText = selectedPlatform === 'youtube' ? 'subscription' : 'follow';
        const pageText = selectedPlatform === 'youtube' ? 'channel' : 'page';
        toast({
          title: 'Verification failed',
          description: `We couldn't verify your ${selectedPlatform} ${actionText}. Please make sure you've ${selectedPlatform === 'youtube' ? 'subscribed to' : 'followed'} our official ${pageText} and try again.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerificationSuccess = () => {
    toast({
      title: 'Phone verified!',
      description: 'You can now earn all available rewards.',
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RewardsHeader 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isLoading={isLoading} 
      />

      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        {!user && (
          <Card className="p-4 md:p-6 bg-blue-50 border-blue-200 mb-6 md:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm md:text-base">Login Required</h3>
                  <p className="text-blue-700 text-xs md:text-sm">Please login to start earning rewards</p>
                </div>
              </div>
              <Button onClick={handleLogin} disabled={isLoading} size="sm">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Card>
        )}

        {user && (
          <div className="mb-6 md:mb-8">
            <RewardsSummary totalPoints={totalPoints} rewardHistory={rewardHistory} />
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-semibold">Available Rewards</h2>
            {isCheckingStatus && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          
          <div className="grid gap-4 md:gap-6">
            <SocialPlatformCard
              platform="facebook"
              icon={<span className="font-bold">f</span>}
              isCompleted={rewardStatus.facebook}
              onFollowClick={() => handleFollowClick('facebook')}
              isLoading={isLoading && selectedPlatform === 'facebook'}
            />
            
            <SocialPlatformCard
              platform="instagram"
              icon={<span className="font-bold">📷</span>}
              isCompleted={rewardStatus.instagram}
              onFollowClick={() => handleFollowClick('instagram')}
              isLoading={isLoading && selectedPlatform === 'instagram'}
            />
            
            <SocialPlatformCard
              platform="tiktok"
              icon={<span className="font-bold">🎵</span>}
              isCompleted={rewardStatus.tiktok}
              onFollowClick={() => handleFollowClick('tiktok')}
              isLoading={isLoading && selectedPlatform === 'tiktok'}
            />

            <SocialPlatformCard
              platform="youtube"
              icon={<span className="font-bold">📺</span>}
              isCompleted={rewardStatus.youtube}
              onFollowClick={() => handleFollowClick('youtube')}
              isLoading={isLoading && selectedPlatform === 'youtube'}
            />

            <ProductReviewCard />
          </div>
        </div>

        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedPlatform(null);
          }}
          platform={selectedPlatform || ''}
          onUpload={handleFileUpload}
          isLoading={isLoading}
        />

        <PhoneVerificationModal
          isOpen={phoneModalOpen}
          onClose={() => setPhoneModalOpen(false)}
          userId={10}
          onSuccess={handlePhoneVerificationSuccess}
        />
      </div>
    </div>
  );
}
