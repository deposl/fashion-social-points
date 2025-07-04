
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Wallet } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface RewardsHeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export function RewardsHeader({ user, onLogin, onLogout, isLoading }: RewardsHeaderProps) {
  const handleWalletClick = () => {
    window.open('https://www.zada.lk/wallet', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-2 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          {/* Logo and User Section Row for Mobile */}
          <div className="flex items-center justify-between md:justify-start md:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-4">
              <img 
                src="https://cdn.zada.lk/uploads/all/JfPAlnm1jxJNTqPLDcEwx8KSf46JsuFpIyjgRWJW.png" 
                alt="Zada Logo" 
                className="h-6 md:h-10 w-auto"
              />
            </div>

            {/* User Section - Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Wallet Button - Mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleWalletClick}
                className="flex items-center gap-1 text-xs px-2"
              >
                <Wallet className="h-3 w-3" />
              </Button>

              {user ? (
                <>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-20">{user.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={onLogout} 
                    size="sm"
                    className="flex items-center gap-1 text-xs px-2"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={onLogin} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2"
                  size="sm"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>

          {/* Title - Mobile positioning under logo */}
          <div className="md:flex-1 md:text-left">
            <h1 className="text-base md:text-2xl font-bold text-gray-900">Rewards Center</h1>
            <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Earn points by following our social media</p>
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Wallet Button - Desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleWalletClick}
              className="flex items-center gap-2 text-sm px-3"
            >
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </Button>

            {user ? (
              <>
                <div className="hidden lg:block text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Welcome back,</span>
                  </div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout} 
                  size="sm"
                  className="flex items-center gap-2 text-sm px-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button 
                onClick={onLogin} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2"
                size="sm"
              >
                {isLoading ? 'Logging in...' : 'Login to Earn'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
