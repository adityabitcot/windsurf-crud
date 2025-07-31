---
description: Pre-Commit Code Review using Code Rabbit
---

# PRE-COMMIT CODE RABBIT REVIEW WORKFLOW

This workflow implements a pre-commit code review process using Code Rabbit to validate code quality before committing changes. It follows the feedback loop in the flowchart to ensure only high-quality code is committed.

## Setup Requirements

1. Install CodeRabbit CLI tool:
   ```bash
   npm install -g coderabbitai-cli
   ```

2. Configure GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Select scope: `repo` (for private repos) or `public_repo` (for public repos)
   - Configure token in `.claude/config.json`:
   ```json
   {
     "mcpServers": {
       "coderabbitai": {
         "command": "npx",
         "args": ["coderabbitai-mcp@latest"],
         "env": {
           "GITHUB_PAT": "your_github_token_here"
         }
       }
     }
   }
   ```

## Pre-Commit Review Workflow

### Step 1: Review Code Before Committing

Before committing your changes, run CodeRabbit review on your modified files:

```bash
coderabbit review --local
```

This will review all modified files in your working directory.

If you want to review specific files or directories:

```bash
coderabbit review path/to/file.js path/to/directory
```

### Step 2: CodeRabbit Analysis

CodeRabbit will analyze your code across multiple dimensions:

- **Code Quality**: Style, syntax, complexity, duplication, documentation
- **Performance**: Efficiency, potential bottlenecks, optimizations
- **Security**: Vulnerabilities, input validation, authentication
- **Best Practices**: Error handling, logging, pattern usage
- **Maintainability**: Organization, modularity, readability

### Step 3: Review Results

CodeRabbit will provide a detailed report with:

1. Overall score (0-100)
2. Component scores for each dimension
3. List of issues found with severity ratings
4. Specific recommendations for improvement

Example output:
```
Overall Score: 85/100

Component Scores:
- Code Quality: 90/100
- Performance: 80/100
- Security: 95/100
- Best Practices: 75/100
- Maintainability: 85/100

Issues Found: 3
- [MEDIUM] Potential memory leak in UserController.js:45
- [LOW] Missing error handling in AuthService.js:126
- [LOW] Inconsistent naming convention in ProfileRepository.js:53
```

### Step 4: Quality Gate Check

The report will indicate whether your code passes the quality threshold:

- **PASSED**: Code meets quality standards and is ready to commit
- **FAILED**: Code needs improvements before committing

### Step 5: Address Feedback Loop

If your code doesn't pass the quality gate:

1. Review the issues and recommendations
2. Make necessary changes to your code
3. Run the review again to verify improvements
```bash
coderabbit review --local
```
4. Repeat until the code passes the quality threshold

### Step 6: Commit Approved Code

Once your code passes the quality threshold:

```bash
# Add your changes
git add .

# Commit with CodeRabbit approval reference
git commit -m "feat: implement new feature (CodeRabbit approved)"
```

## Automated Pre-Commit Integration

To automatically run CodeRabbit before each commit, you can set up a pre-commit hook:

### 1. Install Required Packages

```bash
npm install --save-dev husky lint-staged
```

### 2. Configure Husky in package.json

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "node .windsurf/scripts/coderabbit-check.js"
    }
  }
}
```

### 3. Create CodeRabbit Check Script

Create a script at `.windsurf/scripts/coderabbit-check.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const { exit } = require('process');

console.log('🐰 Running CodeRabbit pre-commit review...');

try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM')
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  
  if (stagedFiles.length === 0) {
    console.log('No files to review. Skipping CodeRabbit check.');
    exit(0);
  }
  
  console.log(`Reviewing ${stagedFiles.length} files with CodeRabbit...`);
  
  // Run CodeRabbit CLI tool
  const result = execSync(`coderabbit review ${stagedFiles.join(' ')} --json`)
    .toString();
  
  const review = JSON.parse(result);
  
  // Check if code passes quality threshold (80 is default)
  if (review.overallScore >= 80) {
    console.log(`✅ CodeRabbit review passed! Score: ${review.overallScore}/100`);
    exit(0);
  } else {
    console.error(`❌ CodeRabbit review failed! Score: ${review.overallScore}/100`);
    console.error('Issues found:');
    
    review.issues.forEach(issue => {
      console.error(`- [${issue.severity}] ${issue.file}:${issue.line}: ${issue.message}`);
    });
    
    // To block the commit, uncomment the line below:
    // exit(1);
    
    // For initial implementation, just warn but allow commit
    console.warn('\nCommit allowed, but please fix the issues before pushing.');
    exit(0);
  }
} catch (error) {
  console.error('Error running CodeRabbit review:', error.message);
  // Allow commit if the tool fails
  console.warn('CodeRabbit check failed, allowing commit to proceed.');
  exit(0);
}
```

### 4. Make Script Executable

```bash
chmod +x .windsurf/scripts/coderabbit-check.js


### Manual Pre-Commit Review

If you want to manually review your changes before committing:

1. Save all your changes in your editor

2. Run the CodeRabbit review from your terminal:
   ```bash
   coderabbit review --local
   ```

3. Review the output and fix any issues reported

4. Run the review again until all issues are resolved

5. Proceed with your commit once the code passes quality checks

## Troubleshooting

- If the pre-commit hook is blocking legitimate commits, you can bypass it with:
  ```bash
  git commit --no-verify
  ```
  Note: Use this sparingly as it defeats the purpose of quality checks.

- If you encounter authentication errors, verify your GitHub token has the correct permissions

- If CodeRabbit CLI fails to start, verify Node.js 14+ is installed

- For scoring discrepancies, check individual component scores for insights

- If reviews repeatedly fail, consider refactoring the problematic code sections
