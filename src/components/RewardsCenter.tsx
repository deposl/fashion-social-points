
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SocialPlatformCard } from './SocialPlatformCard';
import { UploadModal } from './UploadModal';
import { RewardsSummary } from './RewardsSummary';
import { useRewards } from '@/hooks/useRewards';
import { checkLoginStatus, openAuthPopup, logout } from '@/utils/auth';
import { verifyFacebookFollow, verifyInstagramFollow, verifyTikTokFollow, checkUserFollowStatus } from '@/services/rewardsApi';
import { uploadImageToSupabase } from '@/utils/supabase';
import { User, LogOut } from 'lucide-react';

interface User {
  name: string;
  email: string;
}

export function RewardsCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'instagram' | 'tiktok' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const { rewardStatus, rewardHistory, totalPoints, markRewardClaimed } = useRewards();
  const { toast } = useToast();

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      checkFollowStatus();
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

  const checkFollowStatus = async () => {
    if (!user) return;
    
    setIsCheckingStatus(true);
    try {
      const statusResponse = await checkUserFollowStatus(10); // You would get this from your user object
      
      // Check if user has already followed/liked any platforms
      if (statusResponse.facebook_page === 'liked' && !rewardStatus.facebook) {
        markRewardClaimed('facebook');
      }
      if (statusResponse.instagram_page === 'followed' && !rewardStatus.instagram) {
        markRewardClaimed('instagram');
      }
      if (statusResponse.tiktok_page === 'followed' && !rewardStatus.tiktok) {
        markRewardClaimed('tiktok');
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
      // Don't show error toast for status check as it's not critical
    } finally {
      setIsCheckingStatus(false);
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
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleFollowClick = (platform: 'facebook' | 'instagram' | 'tiktok') => {
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
      // Upload image to Supabase and get the URL
      const imageUrl = await uploadImageToSupabase(file);
      console.log("Uploaded image URL:", imageUrl);
      
      const requestData = {
        user_id: 10, // You would get this from your user object
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
      }

      const isSuccess = 
        (selectedPlatform === 'facebook' && response.facebook_page === 'liked') ||
        (selectedPlatform === 'instagram' && response.instagram_page === 'followed') ||
        (selectedPlatform === 'tiktok' && response.tiktok_page === 'followed');

      if (isSuccess) {
        markRewardClaimed(selectedPlatform);
        toast({
          title: 'Congratulations! 🎉',
          description: `You've earned 25 points (Rs 25) for following our ${selectedPlatform} page!`,
        });
      } else {
        toast({
          title: 'Verification failed',
          description: `We couldn't verify your ${selectedPlatform} follow. Please make sure you've followed our official page and try again.`,
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rewards Center</h1>
              <p className="text-gray-600 mt-2">
                Follow our social media pages and earn points worth real money!
              </p>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {!user && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Login Required</h3>
                    <p className="text-blue-700">Please login to start earning rewards</p>
                  </div>
                </div>
                <Button onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Rewards Summary */}
        {user && (
          <div className="mb-8">
            <RewardsSummary totalPoints={totalPoints} rewardHistory={rewardHistory} />
          </div>
        )}

        {/* Social Platform Cards */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Available Rewards</h2>
            {isCheckingStatus && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          
          <div className="grid gap-6">
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
          </div>
        </div>

        {/* Upload Modal */}
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
      </div>
    </div>
  );
}
