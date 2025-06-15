
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, image_url, platform } = await req.json()

    // Your existing n8n webhook URLs
    const API_BASE = 'https://n8n-n8n.hnxdau.easypanel.host/webhook-test';
    const AUTH_HEADER = 'Manoj';

    // Call the n8n webhook based on platform
    const response = await fetch(`${API_BASE}/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Auth': AUTH_HEADER,
      },
      body: JSON.stringify({ user_id, image_url }),
    });

    if (!response.ok) {
      throw new Error(`Failed to verify ${platform} follow`);
    }

    const result = await response.json();
    
    // Check verification result based on platform
    let isVerified = false;
    switch (platform) {
      case 'facebook':
        isVerified = result.facebook_page === 'liked';
        break;
      case 'instagram':
        isVerified = result.instagram_page === 'followed';
        break;
      case 'tiktok':
        isVerified = result.tiktok_page === 'followed';
        break;
      case 'youtube':
        isVerified = result.youtube_page === 'followed';
        break;
    }

    return new Response(
      JSON.stringify({
        success: true,
        platform_verified: isVerified,
        message: isVerified ? 'Verification successful' : 'Verification failed',
        raw_result: result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        platform_verified: false, 
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
