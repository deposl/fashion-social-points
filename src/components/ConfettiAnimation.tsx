
import React, { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function ConfettiAnimation({ isVisible, onComplete }: ConfettiAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s',
            animationIterationCount: '3',
          }}
        />
      ))}
      
      {/* Celebration emojis */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse">
        🎉
      </div>
      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
        ✨
      </div>
      <div className="absolute top-2/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>
        🎊
      </div>
      <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 text-3xl animate-pulse" style={{ animationDelay: '0.6s' }}>
        🌟
      </div>
    </div>
  );
}
