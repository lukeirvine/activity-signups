const { execSync } = require('child_process');

// The commit message will be the first argument after "npm run commit"
const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('Error: Commit message is required.');
  process.exit(1);
}

try {
  // Run lint-fix and stop the script if it fails
  execSync('npm run lint-fix', { stdio: 'inherit' });
} catch (error) {
  console.error('Lint fix failed. Aborting commit.');
  process.exit(1);
}

try {
  // Proceed with the rest of the steps if lint-fix succeeds
  execSync('git add --all', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during commit process:', error.message);
  process.exit(1);
}
