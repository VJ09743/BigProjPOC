# Agentic Workflow Template

A **template repository** for setting up AI-assisted multi-agent development workflows with Claude Code.

## What is this?

This template provides a structured approach to software development where specialized AI agents collaborate to complete tasks:

- **Team Leader**: Orchestrates work and coordinates agents
- **Architect**: Designs systems and creates specifications
- **Developer**: Implements features and writes code
- **Tester**: Tests and validates implementations
- **IT**: Manages infrastructure and releases

## Who is this for?

This template is designed for:
- **Non-programmers** who want AI help building software
- **Teams** wanting structured AI-assisted workflows
- **Projects** needing consistent development processes

## Quick Start

1. **Fork or clone** this repository
2. **Read** `CLAUDE.md` for detailed instructions
3. **Customize** the domain expertise in agent files
4. **Start working** - describe what you want to build!

## Features

- Multi-agent workflow with peer review
- Git worktree support for parallel work
- Task management system
- GitHub Actions for automated peer review
- Structured documentation templates

## Structure

```
├── .claude/agents/      # Agent role definitions
├── .github/workflows/   # GitHub Actions
├── docs/                # Documentation templates
│   ├── tasks/           # Task management
│   ├── architecture/    # Design docs
│   ├── tests/           # Test docs
│   └── it/              # Infrastructure docs
└── CLAUDE.md            # Main configuration
```

## How It Works

1. You describe what you want to build
2. Team Leader analyzes and plans the work
3. Appropriate agents are assigned tasks
4. Agents work independently in git worktrees
5. Peer review ensures quality
6. PRs are created for your review

## Customization

See `CLAUDE.md` for detailed customization instructions:

1. Add your project's domain expertise to agent files
2. Customize project structure for your needs
3. Configure build systems for your technology stack
4. Update GitHub workflows as needed

## License

[Add your license here]
