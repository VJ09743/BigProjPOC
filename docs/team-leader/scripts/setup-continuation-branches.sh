#!/bin/bash
# Setup Continuation Branches Script
# Automatically creates branches with current session ID for all worktrees
#
# Usage: ./setup-continuation-branches.sh [project-name]
# Example: ./setup-continuation-branches.sh {project}

set -e

PROJECT="${1:-{project}}"

# Get current session ID (last 5 chars)
if [ -z "$CLAUDE_CODE_REMOTE_SESSION_ID" ]; then
    echo "❌ ERROR: CLAUDE_CODE_REMOTE_SESSION_ID environment variable not set"
    exit 1
fi

SESSION_ID="${CLAUDE_CODE_REMOTE_SESSION_ID: -5}"

echo "========================================="
echo "Setup Continuation Branches"
echo "========================================="
echo "Project: $PROJECT"
echo "Session ID: $SESSION_ID"
echo "========================================="
echo ""

# Process each agent worktree
for AGENT in architect developer tester it; do
    WORKTREE="/home/user/worktree-${AGENT}"

    if [ ! -d "$WORKTREE" ]; then
        echo "⏭️  Skipping ${AGENT}: worktree not found"
        continue
    fi

    echo "📁 Processing: $AGENT"
    cd "$WORKTREE"

    # Get current branch and latest commit
    CURRENT_BRANCH=$(git branch --show-current)
    LATEST_COMMIT=$(git rev-parse HEAD)
    COMMIT_SHORT="${LATEST_COMMIT:0:7}"

    echo "   Current branch: $CURRENT_BRANCH"
    echo "   Latest commit: $COMMIT_SHORT"

    # Construct new branch name
    NEW_BRANCH="claude/${AGENT}-${PROJECT}-${SESSION_ID}"

    # Check if branch already exists
    if git show-ref --verify --quiet "refs/heads/$NEW_BRANCH"; then
        echo "   ✅ Branch already exists: $NEW_BRANCH"
        git checkout "$NEW_BRANCH"
    else
        # Create new branch from latest commit
        echo "   🔧 Creating branch: $NEW_BRANCH"
        git checkout -b "$NEW_BRANCH" "$LATEST_COMMIT"
        echo "   ✅ Created: $NEW_BRANCH (from $COMMIT_SHORT)"
    fi

    echo ""
done

echo "========================================="
echo "✅ Continuation branches ready!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Verify branches in each worktree"
echo "2. Push to remote when ready:"
echo "   git push -u origin claude/{agent}-${PROJECT}-${SESSION_ID}"
echo "3. Create PR from agent-specific branch"
echo ""
