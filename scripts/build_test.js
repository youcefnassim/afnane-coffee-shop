const { exec } = require('child_process');

console.log('Starting Next.js production build check...');
const child = exec('npx next build', {
  maxBuffer: 1024 * 1024 * 10, // 10MB
  env: {
    ...process.env,
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
