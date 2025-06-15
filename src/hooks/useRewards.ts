
import { useState } from 'react';

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

  const loadRewardData = () => {
    // Always get fresh data from localStorage
    const savedStatus = localStorage.getItem('rewardStatus');
    const savedHistory = localStorage.getItem('rewardHistory');
    
    const currentStatus = savedStatus ? JSON.parse(savedStatus) : { facebook: false, instagram: false, tiktok: false };
    const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
    
    setRewardStatus(currentStatus);
    setRewardHistory(currentHistory);
    setTotalPoints(currentHistory.reduce((total: number, reward: RewardHistory) => total + reward.points, 0));
  };

  const markRewardClaimed = (platform: 'facebook' | 'instagram' | 'tiktok') => {
    // Get fresh data from localStorage first
    const savedStatus = localStorage.getItem('rewardStatus');
    const savedHistory = localStorage.getItem('rewardHistory');
    
    const currentStatus = savedStatus ? JSON.parse(savedStatus) : { facebook: false, instagram: false, tiktok: false };
    const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];

    // Check if reward is already claimed
    if (currentStatus[platform]) {
      return;
    }

    const newStatus = { ...currentStatus, [platform]: true };
    const newReward: RewardHistory = {
      id: Date.now().toString(),
      platform,
      points: 25,
      value: 25,
      earnedAt: new Date(),
    };
    
    const newHistory = [...currentHistory, newReward];
    
    setRewardStatus(newStatus);
    setRewardHistory(newHistory);
    setTotalPoints(newHistory.reduce((total: number, reward: RewardHistory) => total + reward.points, 0));
    
    localStorage.setItem('rewardStatus', JSON.stringify(newStatus));
    localStorage.setItem('rewardHistory', JSON.stringify(newHistory));
  };

  const initializeFromAPI = (followedPlatforms: string[]) => {
    // Always get fresh data from localStorage first
    const savedStatus = localStorage.getItem('rewardStatus');
    const savedHistory = localStorage.getItem('rewardHistory');
    
    const currentStatus = savedStatus ? JSON.parse(savedStatus) : { facebook: false, instagram: false, tiktok: false };
    const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
    
    let statusChanged = false;
    let historyChanged = false;

    // Reset status first to ensure clean state
    const newStatus = { facebook: false, instagram: false, tiktok: false };
    
    followedPlatforms.forEach(platform => {
      const platformKey = platform.toLowerCase() as 'facebook' | 'instagram' | 'tiktok';
      
      // Mark as followed
      newStatus[platformKey] = true;
      statusChanged = true;

      // Add to history only if not already present
      const existingReward = currentHistory.find((reward: RewardHistory) => reward.platform === platformKey);
      if (!existingReward) {
        const newReward: RewardHistory = {
          id: Date.now().toString() + platformKey,
          platform: platformKey,
          points: 25,
          value: 25,
          earnedAt: new Date(),
        };
        currentHistory.push(newReward);
        historyChanged = true;
      }
    });

    // Update state with fresh data
    setRewardStatus(newStatus);
    setRewardHistory(currentHistory);
    setTotalPoints(currentHistory.reduce((total: number, reward: RewardHistory) => total + reward.points, 0));
    
    // Save to localStorage
    localStorage.setItem('rewardStatus', JSON.stringify(newStatus));
    if (historyChanged) {
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
    initializeFromAPI,
    resetRewards,
    loadRewardData,
  };
}
