#!/usr/bin/env node

/**
 * Automated Peer Review Script
 *
 * This script uses Claude API to review pull requests as different agent roles
 * (Team Leader, Architect, Tester, Developer).
 *
 * Usage:
 *   node automated-review.js \
 *     --agent <agent-type> \
 *     --pr-number <number> \
 *     --repo <owner/repo> \
 *     --pr-details-file <path>
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY - Required for Claude API
 *   GITHUB_TOKEN - Required for GitHub API
 */

const Anthropic = require('@anthropic-ai/sdk');
const { Octokit } = require('octokit');
const fs = require('fs');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    parsed[key] = value;
  }

  return parsed;
}

// Agent review prompts and checklists
const AGENT_PROMPTS = {
  'team-leader': {
    role: 'Team Leader Agent',
    title: 'Senior Technical Leader',
    expertise: [
      'Decades of software industry experience',
      'Object-Oriented Architecture and Design Patterns (GoF, SOLID, GRASP)',
      'System architecture and scalability',
      'Code quality standards and best practices'
    ],
    checklist: [
      'Code follows project standards and conventions (naming, formatting, structure)',
      'Design patterns are correctly applied (Strategy, Singleton, Command, Observer)',
      'SOLID principles are followed (Single Responsibility, Open/Closed, etc.)',
      'Documentation is complete and up-to-date (CLAUDE.md, inline comments, README)',
      'Commit messages are clear and descriptive',
      'PR description explains what, why, and how',
      'Overall quality meets project requirements',
      'No architectural anti-patterns introduced'
    ],
    focus: 'overall quality, standards compliance, design patterns, documentation, project alignment'
  },

  'architect': {
    role: 'Architect Agent',
    title: 'System Architect and Design Lead',
    expertise: [
      'Software Architecture and Design (OO principles, SOLID, UML)',
      'Design Patterns (GoF): Creational, Structural, Behavioral',
      'Architectural Patterns: Layered, Hexagonal, Clean, Microservices',
      'Interface and API design',
      'Lithography domain expertise'
    ],
    checklist: [
      'Implementation follows EDS specifications exactly',
      'Interfaces are correctly implemented (SharedLithoState, Thrift)',
      'Design patterns are appropriate and correctly implemented',
      'SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
      'Component boundaries are clear, low coupling, high cohesion',
      'Architecture is maintainable and extensible',
      'Platform support (Linux, macOS) is correctly handled',
      'No architectural violations or design flaws'
    ],
    focus: 'design adherence, SOLID principles, design patterns, architecture quality, interface correctness'
  },

  'tester': {
    role: 'Tester Agent',
    title: 'Quality Assurance and Testing Specialist',
    expertise: [
      'Testing frameworks (gtest, Catch2, JUnit, pytest)',
      'Test design and automation',
      'Quality gates and metrics',
      'Lithography functional testing',
      'Integration and system testing'
    ],
    checklist: [
      'Code is structured for testability',
      'Unit tests are present for all new/modified code',
      'Test coverage is adequate (>80% target)',
      'Tests follow AAA pattern (Arrange, Act, Assert)',
      'Edge cases and error paths are tested',
      'Tests are clear, independent, repeatable, and fast',
      'Integration points are properly tested',
      'Quality gates are met (no test failures, adequate coverage)'
    ],
    focus: 'testability, test coverage, test quality, edge cases, quality gates'
  },

  'developer': {
    role: 'Developer Agent',
    title: 'Software Developer and Implementation Specialist',
    expertise: [
      'Object-Oriented Programming (OOP principles, SOLID, design patterns)',
      'Code quality and clean code principles',
      'Testing (TDD, unit testing, mocking)',
      'Modern practices (Git workflow, code review)',
      'Lithography real-time control algorithms'
    ],
    checklist: [
      'Code is clean, readable, and maintainable',
      'Naming is clear and descriptive',
      'Functions are small and focused (<50 lines)',
      'No code duplication (DRY principle)',
      'Logic is correct and efficient',
      'Error handling is comprehensive',
      'Resource cleanup is proper (RAII, destructors)',
      'No code smells (long methods, large classes, deep nesting, magic numbers)',
      'Best practices: const-correctness, smart pointers, thread safety',
      'Memory management is safe'
    ],
    focus: 'code quality, implementation correctness, best practices, no code smells'
  }
};

// Construct review prompt for Claude
function constructReviewPrompt(agentType, prDetails) {
  const agent = AGENT_PROMPTS[agentType];

  const prompt = `You are the ${agent.title} reviewing a pull request in the BigProjPOC repository.

**Your Role**: ${agent.role}

**Your Expertise**:
${agent.expertise.map(e => `- ${e}`).join('\n')}

**Review Focus**: ${agent.focus}

## Pull Request Details

**Title**: ${prDetails.title}

**Description**:
${prDetails.body}

**Changed Files** (${prDetails.files.length} files):
${prDetails.files.map(f => `- ${f.filename} (+${f.additions}/-${f.deletions})`).join('\n')}

## Your Task

Review this pull request thoroughly using your expertise and the following checklist:

**Review Checklist**:
${agent.checklist.map((item, i) => `${i + 1}. ${item}`).join('\n')}

## Code Changes

${prDetails.files.map(f => `
### File: ${f.filename}
Status: ${f.status}
Changes: +${f.additions}/-${f.deletions}

\`\`\`diff
${f.patch || '(Binary file or no patch available)'}
\`\`\`
`).join('\n')}

## Review Guidelines

1. **Be thorough**: Check every item on your checklist
2. **Be specific**: Point out exact issues with line numbers/file names
3. **Be constructive**: Provide actionable feedback
4. **Be fair**: Acknowledge good work, but don't lower standards
5. **Focus on your expertise**: Apply your domain knowledge

## Response Format

Provide your review in this exact format:

### Summary
[1-2 sentences: overall assessment]

### Inline Comments
[For each specific issue, provide a structured comment that will appear on the code]
[Format: Each comment MUST start with "INLINE_COMMENT:" followed by file path and line number]
[If no inline comments, write "None"]

INLINE_COMMENT: path/to/file.ext:123
**[Severity: Critical/Major/Minor]** [Issue title]
[Detailed explanation of the problem and recommendation for fixing it]

[Repeat for each issue found in the code]

### Positive Aspects
[List good practices observed, or write "None notable" if basic]
- [What was done well]

### Decision
[Write EXACTLY one of these two options:]
✅ **APPROVED** - This PR meets all quality standards for ${agent.role}.
🔴 **CHANGES REQUESTED** - This PR requires changes before approval.

**IMPORTANT**:
- Be strict but fair
- Only approve if ALL checklist items pass
- If there are any Critical or Major issues, you MUST request changes
- Minor issues alone can be approved with suggestions
- Apply SOLID principles and design pattern knowledge rigorously
- For inline comments, always specify the exact file path and line number where the issue exists
- Line numbers should reference the new file content (after changes), not the diff
`;

  return prompt;
}

// Call Claude API for review
async function callClaudeForReview(agentType, prDetails) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = constructReviewPrompt(agentType, prDetails);

  console.log(`\nCalling Claude API as ${agentType}...`);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature: 0.2, // Lower temperature for more consistent reviews
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const review = message.content[0].text;

  console.log(`Review received (${review.length} chars)`);

  return review;
}

// Parse inline comments from review text
function parseInlineComments(reviewText) {
  const comments = [];
  const lines = reviewText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for INLINE_COMMENT: path/to/file:line
    const match = line.match(/^INLINE_COMMENT:\s*(.+):(\d+)\s*$/);

    if (match) {
      const path = match[1].trim();
      const lineNum = parseInt(match[2]);

      // Collect the comment body (lines after INLINE_COMMENT: until next section or empty line)
      let commentBody = '';
      let j = i + 1;

      while (j < lines.length) {
        const nextLine = lines[j];

        // Stop at next INLINE_COMMENT or section header
        if (nextLine.startsWith('INLINE_COMMENT:') ||
            nextLine.startsWith('###') ||
            (nextLine.trim() === '' && lines[j + 1]?.startsWith('INLINE_COMMENT:'))) {
          break;
        }

        commentBody += nextLine + '\n';
        j++;
      }

      commentBody = commentBody.trim();

      if (commentBody && path && lineNum > 0) {
        comments.push({
          path: path,
          line: lineNum,
          body: commentBody
        });

        console.log(`  Parsed inline comment: ${path}:${lineNum}`);
      }

      i = j - 1; // Skip to after this comment
    }
  }

  return comments;
}

// Extract summary from review text (everything before Inline Comments section)
function extractSummary(reviewText) {
  // Get everything from Summary to before Inline Comments section
  const summaryMatch = reviewText.match(/### Summary\s*([\s\S]*?)(?=### Inline Comments|### Positive Aspects|### Decision|$)/);
  const positiveMatch = reviewText.match(/### Positive Aspects\s*([\s\S]*?)(?=### Decision|$)/);
  const decisionMatch = reviewText.match(/### Decision\s*([\s\S]*?)$/);

  let summary = '';

  if (summaryMatch) {
    summary += '### Summary\n' + summaryMatch[1].trim() + '\n\n';
  }

  if (positiveMatch) {
    summary += '### Positive Aspects\n' + positiveMatch[1].trim() + '\n\n';
  }

  if (decisionMatch) {
    summary += '### Decision\n' + decisionMatch[1].trim();
  }

  return summary.trim();
}

// Parse review decision (APPROVED or CHANGES REQUESTED)
function parseReviewDecision(reviewText) {
  if (reviewText.includes('✅ **APPROVED**')) {
    return 'APPROVE';
  } else if (reviewText.includes('🔴 **CHANGES REQUESTED**')) {
    return 'REQUEST_CHANGES';
  } else {
    console.warn('Could not parse decision, defaulting to COMMENT');
    return 'COMMENT';
  }
}

// Post review with inline comments using GitHub Pull Request Review API
async function postPullRequestReview(octokit, repo, prNumber, prDetails, agentType, reviewText, decision) {
  const [owner, repoName] = repo.split('/');
  const agent = AGENT_PROMPTS[agentType];

  // Parse inline comments from review text
  const inlineComments = parseInlineComments(reviewText);

  // Extract summary (without inline comments section)
  const summary = extractSummary(reviewText);

  // Construct review body
  const reviewBody = `## 🤖 **${agent.role} Review**

${summary}

${inlineComments.length > 0 ? `\n**${inlineComments.length} inline comment(s)** posted on specific lines in the "Files changed" tab.\n` : ''}

---

*Automated review by ${agent.role} | Agent expertise: ${agent.focus}*
`;

  console.log(`  Summary: ${summary.substring(0, 100)}...`);
  console.log(`  Inline comments: ${inlineComments.length}`);
  console.log(`  Decision: ${decision}`);

  // Get the commit SHA for the review
  const prData = await octokit.rest.pulls.get({
    owner,
    repo: repoName,
    pull_number: prNumber
  });

  const commitId = prData.data.head.sha;

  // Post the review with inline comments
  try {
    await octokit.rest.pulls.createReview({
      owner,
      repo: repoName,
      pull_number: prNumber,
      commit_id: commitId,
      event: decision, // 'APPROVE', 'REQUEST_CHANGES', or 'COMMENT'
      body: reviewBody,
      comments: inlineComments.map(comment => ({
        path: comment.path,
        line: comment.line,
        body: `**🤖 ${agent.role}**\n\n${comment.body}`
      }))
    });

    console.log(`✅ Posted review as ${agent.role} with ${inlineComments.length} inline comments`);
  } catch (error) {
    console.error(`Error posting review: ${error.message}`);

    // Fallback: Post as regular comment if review API fails
    console.log('Falling back to regular comment...');

    const fallbackComment = `## 🤖 **${agent.role} Review**

${reviewText}

---

*Automated review by ${agent.role} | Agent expertise: ${agent.focus}*

⚠️ Note: Inline comments could not be posted. Issues are listed above.
`;

    await octokit.rest.issues.createComment({
      owner,
      repo: repoName,
      issue_number: prNumber,
      body: fallbackComment
    });

    console.log(`✅ Posted fallback comment as ${agent.role}`);
  }
}

// Main function
async function main() {
  const args = parseArgs();

  // Validate required arguments
  if (!args.agent || !args['pr-number'] || !args.repo || !args['pr-details-file']) {
    console.error('Missing required arguments');
    console.error('Usage: node automated-review.js --agent <type> --pr-number <num> --repo <owner/repo> --pr-details-file <path>');
    process.exit(1);
  }

  // Validate environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const agentType = args.agent;
  const prNumber = parseInt(args['pr-number']);
  const repo = args.repo;
  const prDetailsFile = args['pr-details-file'];

  console.log(`\n========================================`);
  console.log(`Automated Peer Review`);
  console.log(`========================================`);
  console.log(`Agent: ${agentType}`);
  console.log(`PR: #${prNumber}`);
  console.log(`Repo: ${repo}`);
  console.log(`========================================\n`);

  // Load PR details
  const prDetails = JSON.parse(fs.readFileSync(prDetailsFile, 'utf8'));

  // Initialize Octokit
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // Call Claude API for review
  const reviewText = await callClaudeForReview(agentType, prDetails);

  // Parse decision
  const decision = parseReviewDecision(reviewText);

  console.log(`Decision: ${decision}`);

  // Post review with inline comments
  await postPullRequestReview(octokit, repo, prNumber, prDetails, agentType, reviewText, decision);

  console.log(`\n✅ Review complete!`);
}

// Run main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
