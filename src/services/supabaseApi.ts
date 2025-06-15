
import { supabase } from '@/utils/supabase';

export interface VerificationRequest {
  user_id: number;
  image_url: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
}

export interface VerificationResponse {
  success: boolean;
  platform_verified: boolean;
  message: string;
}

export interface UserStatusResponse {
  user_id: number;
  action_type: string;
  verified_at: string;
}

export interface PhoneVerificationRequest {
  user_id: number;
  phone: string;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerifyRequest {
  phone: string;
  otp: string;
}

// Verify social media follow using Supabase Edge Function
export async function verifySocialMediaFollow(request: VerificationRequest): Promise<VerificationResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-social-follow', {
      body: request
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error verifying social media follow:', error);
    throw error;
  }
}

// Check user verification status
export async function checkUserVerificationStatus(userId: number): Promise<UserStatusResponse[]> {
  try {
    const { data, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error checking user verification status:', error);
    throw error;
  }
}

// Phone verification functions
export async function sendOTPSecure(request: OTPRequest): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: request
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export async function verifyOTPSecure(request: OTPVerifyRequest): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: request
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

export async function saveUserPhone(request: PhoneVerificationRequest): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase
      .from('user_phones')
      .upsert({
        user_id: request.user_id,
        phone: request.phone,
        verified_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Phone number saved successfully' };
  } catch (error) {
    console.error('Error saving user phone:', error);
    throw error;
  }
}

export async function checkUserPhone(userId: number): Promise<{ phone_number: 'found' | 'not-found' }> {
  try {
    const { data, error } = await supabase
      .from('user_phones')
      .select('phone')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found
      return { phone_number: 'not-found' };
    }

    if (error) {
      throw new Error(error.message);
    }

    return { phone_number: data ? 'found' : 'not-found' };
  } catch (error) {
    console.error('Error checking user phone:', error);
    return { phone_number: 'not-found' };
  }
}
