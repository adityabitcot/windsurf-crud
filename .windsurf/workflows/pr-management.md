---
description: Create a new PR
---

# Pull Request Management Workflow

## Preparation

1. Make sure you're starting from the latest development branch
   ```bash
   git checkout development
   git pull origin development
   ```

2. Create a new feature branch with descriptive name
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Making Changes

3. Make your code changes and save all files

## Code Review & Commit

4. Review changes and select only specific files to add (not all files)
   ```bash
   git status  # Review changes
   git add [specific-file1] [specific-file2]  # Only add selected files
   ```

5. Commit with a useful and descriptive message
   ```bash
   git commit -m "[type]: [concise description of changes]"
   ```

6. Review changes before pushing
   ```bash
   git diff --staged  # Review what will be pushed
   ```

## Push and Create PR

7. Push the code to remote branch
   ```bash
   git push -u origin [branch-name]
   ```

8. Create a PR targeting the development branch
   - Add a clear title and description
   - Include any relevant issue numbers
   - Request reviews if needed
   - Add any required labels
