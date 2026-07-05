const { exec } = require('child_process');

console.log('Starting Next.js production build check with EMPTY Supabase environment variables...');
const child = exec('npx next build', {
  maxBuffer: 1024 * 1024 * 10, // 10MB
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    NODE_OPTIONS: '--max-old-space-size=4096'
  }
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
});
