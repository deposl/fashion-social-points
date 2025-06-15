
import { useState, useEffect } from 'react';

export interface RewardHistory {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok';
  points: number;
  value: number;
  earnedAt: Date;
}

export interface RewardStatus {
  facebook: boolean;
  instagram: boolean;
  tiktok: boolean;
}

export function useRewards() {
  const [rewardStatus, setRewardStatus] = useState<RewardStatus>({
    facebook: false,
    instagram: false,
    tiktok: false,
  });
  
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadRewardData();
  }, []);

  const loadRewardData = () => {
    const savedStatus = localStorage.getItem('rewardStatus');
    const savedHistory = localStorage.getItem('rewardHistory');
    
    if (savedStatus) {
      setRewardStatus(JSON.parse(savedStatus));
    }
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setRewardHistory(history);
      setTotalPoints(history.reduce((total: number, reward: RewardHistory) => total + reward.points, 0));
    }
  };

  const markRewardClaimed = (platform: 'facebook' | 'instagram' | 'tiktok') => {
    // Check if reward is already claimed to avoid duplicates
    if (rewardStatus[platform]) {
      return;
    }

    const newStatus = { ...rewardStatus, [platform]: true };
    const newReward: RewardHistory = {
      id: Date.now().toString(),
      platform,
      points: 25,
      value: 25,
      earnedAt: new Date(),
    };
    
    const newHistory = [...rewardHistory, newReward];
    
    setRewardStatus(newStatus);
    setRewardHistory(newHistory);
    setTotalPoints(totalPoints + 25);
    
    localStorage.setItem('rewardStatus', JSON.stringify(newStatus));
    localStorage.setItem('rewardHistory', JSON.stringify(newHistory));
  };

  const updateStatusFromAPI = (followedPlatforms: string[]) => {
    // Only update status, don't add to history - this is for API status checks
    const currentStatus = { ...rewardStatus };
    let hasChanges = false;

    followedPlatforms.forEach(platform => {
      const platformKey = platform.toLowerCase() as 'facebook' | 'instagram' | 'tiktok';
      if (!currentStatus[platformKey]) {
        currentStatus[platformKey] = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setRewardStatus(currentStatus);
      localStorage.setItem('rewardStatus', JSON.stringify(currentStatus));
    }
  };

  const initializeRewardsFromAPI = (followedPlatforms: string[]) => {
    // Initialize both status and history for users who already have followed pages
    const currentStatus = { ...rewardStatus };
    const currentHistory = [...rewardHistory];
    let statusChanged = false;
    let historyChanged = false;
    let pointsToAdd = 0;

    followedPlatforms.forEach(platform => {
      const platformKey = platform.toLowerCase() as 'facebook' | 'instagram' | 'tiktok';
      
      // Update status if not already set
      if (!currentStatus[platformKey]) {
        currentStatus[platformKey] = true;
        statusChanged = true;

        // Add to history if not already present
        const existingReward = currentHistory.find(reward => reward.platform === platformKey);
        if (!existingReward) {
          const newReward: RewardHistory = {
            id: Date.now().toString() + platformKey,
            platform: platformKey,
            points: 25,
            value: 25,
            earnedAt: new Date(),
          };
          currentHistory.push(newReward);
          pointsToAdd += 25;
          historyChanged = true;
        }
      }
    });

    if (statusChanged) {
      setRewardStatus(currentStatus);
      localStorage.setItem('rewardStatus', JSON.stringify(currentStatus));
    }

    if (historyChanged) {
      setRewardHistory(currentHistory);
      setTotalPoints(prev => prev + pointsToAdd);
      localStorage.setItem('rewardHistory', JSON.stringify(currentHistory));
    }
  };

  const resetRewards = () => {
    setRewardStatus({ facebook: false, instagram: false, tiktok: false });
    setRewardHistory([]);
    setTotalPoints(0);
    localStorage.removeItem('rewardStatus');
    localStorage.removeItem('rewardHistory');
  };

  return {
    rewardStatus,
    rewardHistory,
    totalPoints,
    markRewardClaimed,
    updateStatusFromAPI,
    initializeRewardsFromAPI,
    resetRewards,
  };
}
