
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://storage-supabase.hnxdau.easypanel.host',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
);

export async function uploadImageToSupabase(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file");
  }

  const timestamp = new Date().getTime();
  const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;

  const { data, error } = await supabase.storage
    .from('zada-ai-s3')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Failed to upload image:", error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Return the correct public URL format
  const imageUrl = `https://storage-supabase.hnxdau.easypanel.host/storage/v1/object/public/zada-ai-s3/${fileName}`;
  console.log("Image uploaded successfully:", imageUrl);
  
  return imageUrl;
}
