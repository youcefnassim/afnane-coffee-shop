const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env variables
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
  console.log("Checking DB...");
  const { data: cats, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error("Categories error:", catError);
  } else {
    console.log(`Found ${cats.length} categories:`);
    cats.forEach(c => console.log(` - ID: ${c.id}, Name: ${JSON.stringify(c.name)}, Sort: ${c.sort_order}`));
  }

  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) {
    console.error("Products error:", prodError);
  } else {
    console.log(`Found ${products.length} products:`);
    products.forEach(p => console.log(` - Name: ${JSON.stringify(p.name)}, Cat: ${p.category_id}, Available: ${p.available}`));
  }
}

check();
