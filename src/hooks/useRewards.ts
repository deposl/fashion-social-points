
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

  const setRewardStatusOnly = (platform: 'facebook' | 'instagram' | 'tiktok') => {
    // Only update status without adding to history (for API status checks)
    if (rewardStatus[platform]) {
      return; // Already marked as completed
    }

    const newStatus = { ...rewardStatus, [platform]: true };
    setRewardStatus(newStatus);
    localStorage.setItem('rewardStatus', JSON.stringify(newStatus));

    // Add to history if not already present
    const existingReward = rewardHistory.find(reward => reward.platform === platform);
    if (!existingReward) {
      const newReward: RewardHistory = {
        id: Date.now().toString(),
        platform,
        points: 25,
        value: 25,
        earnedAt: new Date(),
      };
      
      const newHistory = [...rewardHistory, newReward];
      setRewardHistory(newHistory);
      setTotalPoints(prev => prev + 25);
      localStorage.setItem('rewardHistory', JSON.stringify(newHistory));
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
    setRewardStatusOnly,
    resetRewards,
  };
}
