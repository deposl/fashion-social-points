
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { sendOTP, verifyOTP, clearOTPSession, insertUserPhone } from '@/services/phoneApi';
import { Loader2, Phone, MessageSquare } from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onSuccess: () => void;
}

type Step = 'phone' | 'otp' | 'success';

export function PhoneVerificationModal({ isOpen, onClose, userId, onSuccess }: PhoneVerificationModalProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+94');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length < 12) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(phoneNumber);
      setStep('otp');
      toast({
        title: 'OTP sent',
        description: 'Please check your phone for the verification code',
      });
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast({
        title: 'Failed to send OTP',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    if (!verifyOTP(otpCode)) {
      toast({
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await insertUserPhone(userId, phoneNumber);
      clearOTPSession();
      setStep('success');
      toast({
        title: 'Phone verified successfully',
        description: 'Your phone number has been added to your account',
      });
      
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to insert phone:', error);
      toast({
        title: 'Failed to save phone number',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('+94');
    setOtpCode('');
    clearOTPSession();
    onClose();
  };

  const renderPhoneStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Add Phone Number</h3>
        <p className="text-gray-600 text-sm">
          Please enter your phone number to continue earning rewards
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+94710526900"
          className="text-center"
        />
        <p className="text-xs text-gray-500">
          Enter your phone number with country code (+94)
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handlePhoneSubmit} 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
        <p className="text-gray-600 text-sm">
          We sent a 6-digit code to {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep('phone')} 
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleOTPSubmit} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-green-600 text-xl">✓</span>
      </div>
      <h3 className="text-lg font-semibold text-green-600">Phone Verified!</h3>
      <p className="text-gray-600 text-sm">
        Your phone number has been successfully added to your account
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phone Verification</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {step === 'phone' && renderPhoneStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
