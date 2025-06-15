
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface User {
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
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img 
              src="https://cdn.zada.lk/uploads/all/JfPAlnm1jxJNTqPLDcEwx8KSf46JsuFpIyjgRWJW.png" 
              alt="Zada Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rewards Center</h1>
              <p className="text-sm text-gray-600">Earn points by following our social media</p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:block text-right">
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
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button 
                onClick={onLogin} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
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
