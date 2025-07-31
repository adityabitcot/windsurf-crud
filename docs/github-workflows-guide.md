# GitHub Workflows and MCP Integration Guide

## 1. Introduction

This guide provides detailed instructions for setting up and using GitHub workflows and Model Context Protocol (MCP) integration with Windsurf. It covers obtaining GitHub tokens, configuring MCP services, creating custom workflows, and using available chat commands.

## 2. Setting Up GitHub Personal Access Tokens

GitHub Personal Access Tokens (PATs) are necessary for authenticating API requests to GitHub from external applications like Windsurf's MCP.

### 2.1 Generating a GitHub Token

1. **Log into GitHub**:
   - Visit [github.com](https://github.com) and sign in to your account

2. **Navigate to Settings**:
   - Click on your profile picture in the top right corner
   - Select "Settings" from the dropdown menu

3. **Access Developer Settings**:
   - Scroll down to the bottom of the left sidebar
   - Click on "Developer settings"

4. **Create Personal Access Token**:
   - Select "Personal access tokens" 
   - Choose either "Tokens (classic)" or "Fine-grained tokens" depending on your needs
   - Click "Generate new token"

5. **Configure Token Settings**:
   - Give your token a descriptive name (e.g., "Windsurf MCP Integration")
   - Set an expiration period (recommended for security)
   - Select the necessary scopes:
     - For repository operations: `repo` (full control of repositories)
     - For pull requests: `pull_requests`
     - For workflow actions: `workflow`
     - For user information: `read:user`

6. **Generate and Save Token**:
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately as it will only be shown once
   - Store it securely for later use

### 2.2 Token Security Best Practices

- Never share your token in public repositories or communications
- Use tokens with the minimum necessary permissions
- Set appropriate expiration dates
- Regularly audit and rotate tokens
- Consider using environment variables to store tokens

## 3. Configuring MCP Services

MCP (Model Context Protocol) services extend the capabilities of Windsurf by connecting to external services like GitHub.

### 3.1 MCP Configuration File

The MCP configuration file is typically located at `~/.codeium/windsurf/mcp_config.json`. This file contains authentication details for various MCP services.

### 3.2 Setting Up GitHub MCP

1. **Create or Edit MCP Config File**:
   - Open or create `~/.codeium/windsurf/mcp_config.json`
   - Add GitHub configuration as follows:

```json
{
  "mcp_servers": {
    "github": {
      "auth_type": "bearer",
      "token": "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
    }
  }
}
```

2. **Replace Token Placeholder**:
   - Replace `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` with the token you generated in section 2.1

3. **Restart Windsurf**:
   - After updating the configuration, restart your editor or IDE to reload the MCP configuration

### 3.3 Verifying MCP Integration

To verify your GitHub MCP integration is working correctly:
1. Run a simple GitHub MCP command like searching repositories
2. If successful, you should see results without authentication errors
3. If you encounter errors, double-check your token and permissions

## 4. Creating Custom Workflows

Workflows are defined sequences of steps for common tasks. In Windsurf, workflows are stored as markdown files and can be invoked using slash commands.

### 4.1 Workflow Structure

Workflows are defined in markdown files with a specific structure:

```markdown
---
description: Short description of what this workflow does
---

# Workflow Title

## Section 1
1. Step one instructions
2. Step two instructions
   ```bash
   # Example commands if applicable
   command example
   ```

## Section 2
3. Next step instructions
...
```

### 4.2 Creating a New Workflow

1. **Create Workflow Directory** (if it doesn't exist):
   ```bash
   mkdir -p .windsurf/workflows
   ```

2. **Create a Workflow File**:
   - Create a new markdown file in the workflows directory
   - Name it descriptively, e.g., `pr-management.md` for PR management workflows

3. **Define Workflow Structure**:
   - Add YAML frontmatter with a description
   - Create clear, numbered steps
   - Group related steps under sections
   - Include example commands when applicable

### 4.3 Example: PR Management Workflow

Our PR management workflow is located at `.windsurf/workflows/pr-management.md`:

```markdown
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
```

### 4.4 Workflow Automation Annotations

- **Standard steps**: No annotation, requires manual confirmation
- **Turbo steps**: Add `// turbo` above a step to auto-run that specific step
- **Turbo-all**: Add `// turbo-all` anywhere in the workflow to auto-run all steps

## 5. Available Chat Commands

Chat commands are used to interact with Windsurf and invoke workflows.

### 5.1 Slash Commands

- **/pr-management**: Invokes the PR management workflow
- **/help**: Shows a list of available commands
- Other commands will be listed in the help output

### 5.2 Using a Workflow

To use a workflow:
1. Type the slash command in the chat (e.g., `/pr-management`)
2. Follow the steps provided by the workflow
3. Provide any requested information

## 6. Best Practices

### 6.1 For GitHub Integration

- Keep your repository clean with a proper .gitignore file
- Use meaningful branch names (feature/, bugfix/, etc.)
- Write descriptive commit messages
- Create detailed PR descriptions
- Request reviews from relevant team members
- Link PRs to issues when applicable

### 6.2 For Workflows

- Keep workflows focused on a single task
- Use clear, numbered steps
- Include example commands when helpful
- Group related steps under headings
- Update workflows when processes change

### 6.3 For Security

- Don't hardcode tokens in code or workflows
- Use environment variables for sensitive data
- Rotate tokens periodically
- Use minimal permissions for tokens

## 7. Troubleshooting

### 7.1 Common GitHub MCP Issues

- **Authentication failures**: Check that your token is valid and has the necessary permissions
- **Rate limiting**: GitHub API has rate limits; if exceeded, wait or use a token with higher limits
- **Permission denied**: Ensure you have access to the repository you're working with

### 7.2 Workflow Issues

- **Command not found**: Ensure the command exists and is installed
- **Permission denied**: Check file permissions
- **Missing configuration**: Verify that all necessary configuration files exist

## 8. Conclusion

Proper setup of GitHub tokens, MCP services, and custom workflows enables efficient development processes. Following the guidelines in this document will help you create a streamlined development workflow with Windsurf and GitHub integration.
