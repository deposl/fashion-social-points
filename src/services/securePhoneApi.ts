
import { sendOTPSecure, verifyOTPSecure, saveUserPhone } from './supabaseApi';

export interface PhoneVerificationState {
  phone: string;
  otp: string;
  isVerifying: boolean;
}

export async function sendSecureOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
  try {
    const result = await sendOTPSecure({ phone: phoneNumber });
    
    if (result.success) {
      // Store phone in session for verification
      sessionStorage.setItem('otp_phone', phoneNumber);
    }
    
    return result;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
}

export async function verifySecureOTP(otp: string): Promise<{ success: boolean; message: string }> {
  try {
    const phone = sessionStorage.getItem('otp_phone');
    if (!phone) {
      throw new Error('Phone number not found. Please try again.');
    }

    const result = await verifyOTPSecure({ phone, otp });
    
    if (result.success) {
      // Clear session data on successful verification
      sessionStorage.removeItem('otp_phone');
    }
    
    return result;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP. Please try again.');
  }
}

export async function savePhoneNumber(userId: number, phone: string): Promise<{ success: boolean; message: string }> {
  try {
    return await saveUserPhone({ user_id: userId, phone });
  } catch (error) {
    console.error('Error saving phone number:', error);
    throw new Error('Failed to save phone number. Please try again.');
  }
}

export function clearOTPSession(): void {
  sessionStorage.removeItem('otp_phone');
}
