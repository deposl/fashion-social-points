
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
    const { phone } = await req.json()

    const TEXT_LK_API = 'https://app.text.lk/api/http/sms/send';
    const TEXT_LK_TOKEN = '800|edUcwE7TFH3BoJXcxHyHR8BAtMngyn4J8nqszkyD279bac62';

    const response = await fetch(TEXT_LK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        api_token: TEXT_LK_TOKEN,
        recipient: phone,
        sender_id: 'TextLKDemo',
        type: 'otp',
        message: 'Hi Your ZADA.LK OTP is {{OTP}}',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }

    const result = await response.json();
    
    if (result.status === 'success' && result.data && result.data.otp) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'OTP sent successfully',
          otp: result.data.otp // Only for testing, remove in production
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      throw new Error(result.message || 'Failed to send OTP');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
