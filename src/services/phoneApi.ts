export interface CheckPhoneRequest {
  user_id: number;
}

export interface CheckPhoneResponse {
  phone_number: 'found' | 'not-found';
}

export interface InsertPhoneRequest {
  user_id: number;
  phone: string;
}

export interface SendOTPRequest {
  recipient: string;
  sender_id: string;
  type: string;
  message: string;
}

export interface SendOTPResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

const API_BASE = 'https://n8n-n8n.hnxdau.easypanel.host/webhook';
const AUTH_HEADER = 'Manoj';
const TEXT_LK_API = 'https://app.text.lk/api/http/sms/send';
const TEXT_LK_TOKEN = '800|edUcwE7TFH3BoJXcxHyHR8BAtMngyn4J8nqszkyD279bac62';

export async function checkUserPhone(userId: number): Promise<CheckPhoneResponse> {
  const response = await fetch(`${API_BASE}/check-phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check user phone');
  }

  const data = await response.json();
  console.log('Phone check API response:', data);
  
  // Handle the actual API response format: [{"phone_number":"not found"}] or [{"phone_number":"found"}]
  if (data && data.length > 0) {
    const phoneStatus = data[0].phone_number;
    // Normalize the response - API returns "not found" but we expect "not-found"
    return {
      phone_number: phoneStatus === 'not found' ? 'not-found' : 'found'
    };
  }
  
  // Default to not-found if response is unexpected
  return { phone_number: 'not-found' };
}

export async function insertUserPhone(userId: number, phone: string): Promise<void> {
  const response = await fetch(`${API_BASE}/insert-phone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId, phone }),
  });

  if (!response.ok) {
    throw new Error('Failed to insert user phone');
  }
}

export async function sendOTP(phoneNumber: string): Promise<SendOTPResponse> {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  const response = await fetch(TEXT_LK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      api_token: TEXT_LK_TOKEN,
      recipient: phoneNumber,
      sender_id: 'TextLKDemo',
      type: 'otp',
      message: `Hi Your ZADA.LK OTP is ${otpCode}`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP');
  }

  const result = await response.json();
  
  // Store OTP temporarily (in a real app, you'd use a more secure method)
  sessionStorage.setItem('otp_code', otpCode);
  sessionStorage.setItem('otp_phone', phoneNumber);
  
  return result;
}

export function verifyOTP(enteredCode: string): boolean {
  const storedCode = sessionStorage.getItem('otp_code');
  return storedCode === enteredCode;
}

export function clearOTPSession(): void {
  sessionStorage.removeItem('otp_code');
  sessionStorage.removeItem('otp_phone');
}
