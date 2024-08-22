const { execSync } = require('child_process');

const args = process.argv.slice(2);

// Find the index of the "-m" argument
const messageIndex = args.indexOf('-m');

// Get the commit message, which should be the next argument after "-m"
const commitMessage = messageIndex > -1 ? args[messageIndex + 1] : null;

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
