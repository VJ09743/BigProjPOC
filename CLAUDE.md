# Claude Code Agentic Workflow Template

## Overview

This is a **template repository** for setting up a multi-agent workflow with Claude Code. It provides a structured approach to software development where specialized AI agents (Team Leader, Architect, Developer, Tester, IT) collaborate to complete tasks.

**This template is designed for non-programmers** who want to leverage AI-assisted development workflows for their software projects.

## Quick Start

1. **Fork or clone this repository** for your new project
2. **Customize the Domain Section** below with your project's domain expertise
3. **Update the Project Structure** to match your needs
4. **Start working** - tell Claude what you want to build!

---

## Domain: [Your Project Domain]

**CUSTOMIZE THIS SECTION** for your specific project.

Replace this section with your project's domain context. Examples:

### Example: E-commerce Platform
```
**Industry**: Retail Technology
- Online shopping systems
- Payment processing and checkout flows
- Inventory management and fulfillment
- Customer experience and personalization
```

### Example: Healthcare Application
```
**Industry**: Healthcare IT
- Patient data management
- HIPAA compliance requirements
- Clinical workflow integration
- Electronic health records (EHR)
```

### Example: Financial Services
```
**Industry**: FinTech
- Transaction processing
- Regulatory compliance (SOX, PCI-DSS)
- Real-time data processing
- Risk management and fraud detection
```

**Agent Domain Expertise**:
All agents should understand your project's domain to make informed decisions. Update the agent files in `.claude/agents/` to include relevant domain expertise.

---

## Project Structure

```
YourProject/
├── .claude/                 # Claude Code configuration
│   ├── agents/             # Agent role definitions
│   │   ├── team-leader-agent.md   # Orchestrator and planner
│   │   ├── it-agent.md            # Infrastructure specialist
│   │   ├── architect-agent.md     # System designer
│   │   ├── developer-agent.md     # Implementation specialist
│   │   └── tester-agent.md        # QA specialist
│   └── settings.json       # Project settings
├── .github/                 # GitHub configuration
│   ├── workflows/          # GitHub Actions for peer review
│   └── scripts/            # Automation scripts
├── docs/                   # Project documentation
│   ├── tasks/              # Task management system
│   │   ├── it/             # Tasks for IT Agent
│   │   ├── architect/      # Tasks for Architect Agent
│   │   ├── developer/      # Tasks for Developer Agent
│   │   └── tester/         # Tasks for Tester Agent
│   ├── architecture/       # Architecture docs
│   │   ├── eps/            # External Product Specifications
│   │   ├── eds/            # External Design Specifications
│   │   ├── interfaces/     # Interface specifications
│   │   ├── tasks/          # Development tasks
│   │   └── decisions/      # Architecture Decision Records
│   ├── requirements/       # Requirements docs
│   ├── tests/              # Test documentation
│   │   ├── plans/          # Test plans
│   │   ├── reports/        # Test reports
│   │   └── bugs/           # Bug reports
│   ├── it/                 # IT documentation
│   │   ├── build/          # Build system docs
│   │   ├── releases/       # Release docs
│   │   └── infrastructure/ # Infrastructure docs
│   └── team-leader/        # Team leader docs
│       ├── plans/          # Planning documents
│       ├── lessons-learned/# Lessons learned
│       └── scripts/        # Helper scripts
├── src/                    # Your source code (customize as needed)
├── tests/                  # Your tests (customize as needed)
├── release/                # Release artifacts
├── CLAUDE.md               # This file
└── README.md               # Project readme
```

**Note**: Customize this structure for your project. Add or remove directories as needed.

---

## Agent System

This template uses a **multi-agent system** where Claude Code adopts specialized roles based on the task. The agents work together through a structured workflow.

### Agent Roles

#### Team Leader Agent
**Role**: Senior Technical Leader and Task Orchestrator

- **ALWAYS activates first** for new user requests
- Breaks down complex tasks using design patterns
- Creates git worktrees for independent agent work
- Facilitates peer review process
- Ensures quality before user review

**Activates for**: Any new task from user, coordination, planning

#### IT Agent
**Role**: Infrastructure and Operations Specialist

- Maintains build infrastructure
- Manages releases and versioning
- Sets up CI/CD pipelines
- Documents infrastructure

**Activates for**: Build systems, releases, infrastructure, tools

#### Architect Agent
**Role**: System Architect and Design Lead

- Gathers and documents requirements
- Creates specifications (EPS, EDS)
- Designs interfaces and APIs
- Creates development tasks

**Activates for**: New features, specifications, design, architecture

#### Developer Agent
**Role**: Software Developer and Implementation Specialist

- Implements features and interfaces
- Writes clean, maintainable code
- Creates unit tests
- Follows specifications

**Activates for**: Implementation, coding, bug fixes, unit tests

#### Tester Agent
**Role**: Quality Assurance and Testing Specialist

- Creates test plans
- Writes automated tests
- Validates implementations
- Reports bugs

**Activates for**: Testing, QA, validation, bug reporting

### Agent Workflow

The agents work together in a collaborative workflow:

```
User Request
    ↓
Team Leader (Analyzes & Plans)
    ↓
Create Git Worktrees → Assign to Agent(s)
    ↓
Agent(s) Work Independently
    ↓
Peer Review (2+ agents)
    ↓
Create PR for User Review
    ↓
User Reviews & Merges
```

### Git Worktree Workflow

Agents work in separate git worktrees to enable parallel work:

```bash
# Team Leader creates worktrees
git worktree add ../worktree-architect claude/architect-{project}-{sessionID}
git worktree add ../worktree-developer claude/developer-{project}-{sessionID}

# Each agent works independently in their worktree
# When done, merge back via PR
```

**Branch Naming Convention**:
- Format: `claude/{agent}-{project}-{sessionID}`
- Example: `claude/developer-myproject-abc123`
- This is REQUIRED for remote pushes to succeed

### Peer Review Process

Before PRs go to user review:

1. Agent completes work in their worktree
2. Requests review from 2+ relevant agents
3. Peers review for design, quality, patterns
4. Address feedback and get approvals
5. Only then create PR for user review

---

## Task Management

### Task Folders

- `docs/tasks/it/` - Infrastructure tasks
- `docs/tasks/architect/` - Design tasks
- `docs/tasks/developer/` - Implementation tasks
- `docs/tasks/tester/` - Testing tasks

### Creating Tasks

1. Copy `TEMPLATE.md` to new file
2. Fill in objective, requirements, deliverables
3. Set status and priority
4. Tell Claude to process the task

### Task Lifecycle

```
pending → in-progress → completed → archived
              ↓
           blocked
```

---

## Development Guidelines

### Code Organization
- Keep source code in `src/` or module-specific directories
- Tests in `tests/` or module-specific test directories
- Build artifacts excluded from version control

### Git Workflow
- Main branch: `master` or `main`
- Feature branches: `claude/{agent}-{project}-{sessionID}`
- Always test before committing

### Testing Strategy

**Test Levels**:
1. **Unit Tests** (Developer) - Individual functions/classes
2. **Component Tests** (Tester) - Components in isolation
3. **Integration Tests** (Tester) - Component interactions
4. **System Tests** (Tester) - End-to-end workflows

---

## GitHub Integration

### Authentication

Set up a GitHub token for automated PR creation:

```bash
# Store token in .github_token (excluded from git)
echo "your_github_token" > .github_token
```

### Creating Pull Requests

Agents create PRs using:

```bash
export GH_TOKEN=$(cat .github_token)
gh pr create --base master --head <branch> \
  --title "Title" \
  --body "Description"
```

### Automated Peer Review

The `.github/workflows/` directory contains workflows for automated peer review assignment and tracking.

---

## Customization Guide

### 1. Update Domain Expertise

Edit each agent file in `.claude/agents/` to include your project's domain knowledge.

### 2. Customize Project Structure

Modify the directory structure to match your project's needs:
- Add source directories for your modules
- Configure build systems for your technology stack
- Set up test directories appropriate for your frameworks

### 3. Configure Build System

Add build scripts appropriate for your technology:
- Makefiles for C/C++ projects
- package.json for Node.js
- requirements.txt for Python
- build.gradle for Java

### 4. Update GitHub Workflows

Modify `.github/workflows/` for your CI/CD needs.

---

## Notes for Claude

- Automatically adopt appropriate agent role based on task
- Read agent configs in `.claude/agents/` for responsibilities
- Follow peer review process before creating PRs
- Document decisions in appropriate docs folders
- Keep this CLAUDE.md updated when structure changes

---

## Getting Started

1. **Describe your project** to Claude
2. Claude will ask clarifying questions
3. Work begins with Team Leader analysis
4. Agents collaborate to complete the work
5. Review and merge PRs

**Example first request**:
"I want to build a web application for managing tasks. It should have user authentication, task creation, and notifications."

---

**Template Version**: 1.0
**Last Updated**: 2026-01-25
