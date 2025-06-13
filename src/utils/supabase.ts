
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://storage-supabase.hnxdau.easypanel.host',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
);

export async function uploadImageToSupabase(file: File): Promise<string> {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
  const filePath = `rewards/${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl;
}
