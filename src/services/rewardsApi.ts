export interface VerificationRequest {
  user_id: number;
  image_url: string;
}

export interface VerificationResponse {
  facebook_page?: 'liked' | 'not-liked';
  instagram_page?: 'followed' | 'not-followed';
  tiktok_page?: 'followed' | 'not-followed';
  youtube_page?: 'followed' | 'not-followed';
}

export interface UserStatusRequest {
  user_id: number;
}

export interface UserStatusResponse {
  user_id: number;
  action_type: string;
}

const API_BASE = 'https://n8n-n8n.hnxdau.easypanel.host/webhook-test';
const STATUS_API = 'https://n8n-n8n.hnxdau.easypanel.host/webhook/fetch-status';
const AUTH_HEADER = 'Manoj';

export async function checkUserStatus(userId: number): Promise<UserStatusResponse[]> {
  const response = await fetch(STATUS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check user status');
  }

  const data = await response.json();
  // Handle empty object case
  if (Array.isArray(data) && data.length === 1 && Object.keys(data[0]).length === 0) {
    return [];
  }
  return data;
}

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

export async function checkFacebookStatus(userId: number): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/facebook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check Facebook status');
  }

  return response.json();
}

export async function checkInstagramStatus(userId: number): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/instagram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check Instagram status');
  }

  return response.json();
}

export async function checkTikTokStatus(userId: number): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/tiktok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check TikTok status');
  }

  return response.json();
}

export async function checkYouTubeStatus(userId: number): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/youtube`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check YouTube status');
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

export async function verifyYouTubeFollow(data: VerificationRequest): Promise<VerificationResponse> {
  const response = await fetch(`${API_BASE}/youtube`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Auth': AUTH_HEADER,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to verify YouTube follow');
  }

  return response.json();
}
