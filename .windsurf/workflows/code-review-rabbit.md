---
description: Code Review using Code Rabbit
---

# Code Review with Code Rabbit MCP Server

This workflow guides you through setting up and using Code Rabbit for code reviews before deployment.

## Setup (One-time)

1. Create a GitHub Personal Access Token
   - Go to https://github.com/settings/tokens
   - Select scope: `repo` (for private repos) or `public_repo` (for public repos)
   - Copy your token for later use

2. Configure Code Rabbit MCP Server
   - Create `.claude` directory in project root if it doesn't exist:
     ```
     mkdir -p .claude
     ```
   - Create or edit `.claude/config.json`:
     ```json
     {
       "mcpServers": {
         "coderabbitai": {
           "command": "npx",
           "args": ["coderabbitai-mcp@latest"],
           "env": {
             "GITHUB_PAT": "${GITHUB_PAT}"
           }
         }
       }
     }
     ```
   - Then set the `GITHUB_PAT` environment variable before starting Claude:
     ```
     export GITHUB_PAT=your_github_token_here
     ```

## Local Code Review Process

1. Make your code changes locally
   - Complete your feature or bug fix implementation
   - Make sure all files are saved

2. Start Claude with Code Rabbit MCP server
   - Make sure your GitHub PAT is set: `export GITHUB_PAT=your_github_token_here`
   - Start Claude

3. Request a local code review
   - Ask Claude: "Review my local changes using Code Rabbit"
   - Or specify files: "Review src/users/users.service.ts using Code Rabbit"
   
4. Implement feedback
   - Code Rabbit will analyze your code and provide feedback
   - Use Claude to help implement the suggested changes
   - Make necessary improvements based on the review

5. Re-review if needed
   - After making changes, you can request another review
   - Continue this cycle until you're satisfied with the code quality

6. Deploy to GitHub
   - Only after your code passes the local review:
     - Commit your changes: `git commit -m "descriptive message"`
     - Push to GitHub: `git push origin your-branch-name`
   - Create a PR if needed using the `/pr-management` workflow

## Remote PR Review (Optional)

If you want additional review after creating a PR:

1. Request a PR review
   - Ask Claude to review your PR using Code Rabbit
   - Example: "Review my PR #42 in adityabitcot/windsurf-crud using Code Rabbit"

2. Implement any additional feedback from the PR review

## Troubleshooting

- If you encounter errors about authentication, check your GitHub token permissions
- If the MCP server fails to start, ensure you have Node.js 18+ installed
- For more details, visit: https://github.com/bradthebeeble/coderabbitai-mcp
