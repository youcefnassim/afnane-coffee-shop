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
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking Gallery Table...");
  const { data: gallery, error: galError } = await supabase.from('gallery').select('*');
  if (galError) {
    console.error("Gallery table error:", galError);
  } else {
    console.log(`Found ${gallery.length} gallery items.`);
  }

  console.log("Checking Storage Buckets...");
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Bucket list error:", bucketError);
  } else {
    console.log("Buckets found:");
    buckets.forEach(b => console.log(` - ${b.name} (Public: ${b.public})`));
  }
}

check();
