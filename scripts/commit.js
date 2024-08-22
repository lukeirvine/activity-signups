const { execSync } = require('child_process');

// The commit message will be the first argument after "npm run commit"
const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('Error: Commit message is required.');
  process.exit(1);
}

// ANSI escape codes for coloring
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

try {
  // Run lint-fix and capture output while forcing color
  const lintFixOutput = execSync('FORCE_COLOR=1 npm run lint-fix', { stdio: 'pipe' });

  // Print the output to the console to preserve color
  process.stdout.write(lintFixOutput);

  // Convert buffer to string and check for warnings
  const lintFixOutputString = lintFixOutput.toString();
  if (lintFixOutputString.includes('Warning:')) {
    console.error(`${RED}Lint fix completed with warnings. Aborting commit.${RESET}`);
    process.exit(1);
  }

  console.log('Lint fix completed without warnings.');
} catch (error) {
  console.error(`${RED}Lint fix failed. Aborting commit.${RESET}`);
  console.error(error);
  process.exit(1);
}

try {
  // Proceed with the rest of the steps if lint-fix succeeds without warnings
  execSync('git add --all', { stdio: 'inherit' });
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (error) {
  console.error('Error during commit process:', error.message);
  process.exit(1);
}
