# GitHub Actions: Multi-Agent Review Guide

This guide explains how to trigger the automated multi-agent peer review system.

## Overview

The repository has two GitHub Actions workflows for automated peer review:

1. **PR Review Assignment** (`pr-review-assignment.yml`)
   - Adds labels and posts review checklist
   - No API cost (uses GitHub API only)

2. **Automated Multi-Agent Peer Review** (`automated-peer-review.yml`)
   - Runs AI agents (Claude) to review code
   - Posts inline comments and approval/rejection
   - Requires `ANTHROPIC_API_KEY` secret

## How to Trigger Multi-Agent Review

### Step 1: Create a PR with Correct Branch Name

Branch must match pattern: `claude/{agent}-{project}-{sessionID}` or `agent/{agent}-{project}-{sessionID}`

Examples:
- `claude/architect-viral-content-hub-abc123`
- `claude/developer-viral-content-hub-abc123`
- `agent/it-joke-website-xyz789`

### Step 2: Go to GitHub Actions Tab

1. Navigate to your repository on GitHub
2. Click **Actions** tab
3. Select **Automated Multi-Agent Peer Review** from left sidebar

### Step 3: Trigger the Workflow

1. Click **Run workflow** button (right side)
2. Enter the **PR number** (e.g., `42`)
3. Click **Run workflow** (green button)

```
┌─────────────────────────────────────────────┐
│ Run workflow                                 │
├─────────────────────────────────────────────┤
│ PR number to review: [ 42 ]                 │
│                                             │
│ [Cancel]              [Run workflow]        │
└─────────────────────────────────────────────┘
```

### Step 4: Wait for Review

The workflow will:
1. Detect which agent created the PR (from branch name)
2. Determine required reviewers based on the matrix:

| PR Author | Reviewers |
|-----------|-----------|
| Developer | Architect, Tester |
| Architect | Developer, Tester |
| Tester | Developer, Team Leader |
| IT | Architect |

3. Run each reviewer agent sequentially
4. Post inline comments on the PR
5. Add labels: `peer-review:approved` or `peer-review:changes-requested`

## Review Assignment Workflow (No API Cost)

If you just want labels and checklists without AI review:

1. Go to **Actions** → **PR Review Assignment (Manual)**
2. Click **Run workflow**
3. Enter PR number
4. Click **Run workflow**

This adds review labels and posts a checklist comment.

## Required Secrets

Set these in your repository settings:

1. **ANTHROPIC_API_KEY** (Required for AI review)
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key

2. **GITHUB_TOKEN** (Automatic)
   - Provided automatically by GitHub Actions

## Workflow Diagram

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Agent creates│     │ User triggers   │     │ AI Agents review │
│ PR on branch │ ──→ │ GitHub Action   │ ──→ │ and post comments│
│              │     │                 │     │                  │
│ claude/...   │     │ Enter PR number │     │ Approve/Reject   │
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                      │
                                                      ▼
                                             ┌──────────────────┐
                                             │ Labels updated   │
                                             │ ready-for-merge  │
                                             │ or needs-changes │
                                             └──────────────────┘
```

## Enforcing PR at Each Handoff (Workflow Integration)

To ensure PRs are created at each agent handoff:

### In Claude Code Sessions

The AI agent should:

1. **Complete work** for their role
2. **Create a branch** with correct naming:
   ```bash
   git checkout -b claude/{agent}-{project}-{sessionID}
   ```
3. **Commit and push**:
   ```bash
   git add <files>
   git commit -m "[Agent] Description of work"
   git push -u origin claude/{agent}-{project}-{sessionID}
   ```
4. **Create PR**:
   ```bash
   gh pr create --base master_{project} \
     --title "[Agent] Description" \
     --body "## Summary
   - Work completed

   ## Ready for: Next Agent Name"
   ```
5. **Notify user** to trigger the review workflow

### Review Workflow

```
Architect creates PR → User triggers review → AI reviews
                                                 ↓
                                    If approved → IT Agent starts
                                    If rejected → Architect fixes

IT Agent creates PR → User triggers review → AI reviews
                                                 ↓
                                    If approved → Developer starts
                                    If rejected → IT fixes

Developer creates PR → User triggers review → AI reviews
                                                 ↓
                                    If approved → Tester starts
                                    If rejected → Developer fixes

... and so on
```

## Troubleshooting

### "Branch does not match expected pattern"

Ensure your branch follows the pattern:
- `claude/{agent}-{project}-{sessionID}`
- `agent/{agent}-{project}-{sessionID}`

Valid agent names: `architect`, `developer`, `it`, `tester`, `team-leader`

### "ANTHROPIC_API_KEY not set"

Add the secret in repository settings (see Required Secrets section).

### Review not posting comments

Check the workflow run logs in Actions tab for errors.

## Cost Considerations

- Each AI review uses Claude API tokens
- Workflow is manual to prevent accidental high costs
- Consider limiting reviews to final PRs only
- Use PR Review Assignment workflow for free label/checklist
