
export interface VerificationRequest {
  user_id: number;
  image_url: string;
}

export interface VerificationResponse {
  facebook_page?: 'liked' | 'not-followed';
  instagram_page?: 'followed' | 'not-followed';
  tiktok_page?: 'followed' | 'not-followed';
}

export interface UserStatusRequest {
  user_id: number;
}

const API_BASE = 'https://n8n-n8n.hnxdau.easypanel.host/webhook-test';
const AUTH_HEADER = 'Manoj';

export async function checkUserFollowStatus(userId: number): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/check-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check user follow status');
  }

  return response.json();
}

export async function verifyFacebookFollow(data: VerificationRequest): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/facebook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to verify Facebook follow');
  }

  return response.json();
}

export async function verifyInstagramFollow(data: VerificationRequest): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/instagram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to verify Instagram follow');
  }

  return response.json();
}

export async function verifyTikTokFollow(data: VerificationRequest): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/tiktok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to verify TikTok follow');
  }

  return response.json();
}
