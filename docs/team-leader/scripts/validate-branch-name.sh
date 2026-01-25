#!/bin/bash
# Branch Name Validation Script
# Usage: ./validate-branch-name.sh <agent-type>
# Example: ./validate-branch-name.sh developer

set -e

AGENT_TYPE="${1:-developer}"
CURRENT_BRANCH=$(git branch --show-current)
EXPECTED_PATTERN="^claude/${AGENT_TYPE}-[a-z]+-[a-zA-Z0-9]+$"

echo "Validating branch name for ${AGENT_TYPE} agent..."
echo "Current branch: $CURRENT_BRANCH"

if [[ ! "$CURRENT_BRANCH" =~ $EXPECTED_PATTERN ]]; then
    echo ""
    echo "❌ ERROR: Invalid branch name: $CURRENT_BRANCH"
    echo "❌ Branch must match pattern: claude/${AGENT_TYPE}-{project}-{sessionID}"
    echo "❌ Example: claude/${AGENT_TYPE}-{project}-pbCFa"
    echo "❌ CANNOT create PR - automated peer review will fail!"
    echo ""
    echo "📝 Automated peer review requires agent-specific branch names"
    echo "📝 Generic branches (claude/create-pull-request-*) cause reviews to skip"
    echo ""
    echo "Action Required:"
    echo "1. Contact Team Leader to set up correct branch, OR"
    echo "2. Create new branch with current session ID:"
    echo ""
    echo "   SESSION_ID=\"\${CLAUDE_CODE_REMOTE_SESSION_ID: -5}\""
    echo "   git checkout -b claude/${AGENT_TYPE}-{project}-\$SESSION_ID"
    echo ""
    exit 1
fi

echo "✅ Branch name valid: $CURRENT_BRANCH"
echo "✅ Automated peer review will work correctly"
exit 0
