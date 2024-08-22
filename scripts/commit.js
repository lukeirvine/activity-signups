const { execSync } = require('child_process');

// The commit message will be the first argument after "npm run commit"
const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('Error: Commit message is required.');
  process.exit(1);
}

try {
  execSync('npm run lint-fix', { stdio: 'inherit' });
  execSync('git add --all', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during commit process:', error.message);
  process.exit(1);
}
