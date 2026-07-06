const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const parts = line.split('=');
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
// We need the service role key to create buckets, but let's try with anon key first, maybe it works if RLS allows it?
// Actually, creating buckets usually requires admin privileges, but let's see.
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Creating afnene-media bucket...");
  const { data, error } = await supabase.storage.createBucket('afnene-media', {
    public: true,
    allowedMimeTypes: ['image/*', 'video/*'],
    fileSizeLimit: 20971520 // 20MB
  });

  if (error) {
    console.error("Error creating bucket:", error.message);
  } else {
    console.log("Bucket created successfully:", data);
  }
}

check();
