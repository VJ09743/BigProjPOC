# Claude Code Agent System

This directory contains agent role definitions for the BigProjPOC project. Claude Code automatically adopts these specialized roles based on the task at hand.

## Agent Files

- **`it-agent.md`**: IT/Infrastructure Agent - manages builds, releases, and infrastructure
- **`architect-agent.md`**: Architect Agent - designs systems, creates specifications, and plans tasks
- **`developer-agent.md`**: Developer Agent - implements features, writes code, and creates unit tests
- **`tester-agent.md`**: Tester Agent - tests implementations, validates quality, and reports bugs

## How It Works

You don't need to explicitly invoke these agents. Claude Code will:

1. **Analyze your request** to understand the type of task
2. **Select the appropriate agent role** based on activation triggers defined in each agent file
3. **Adopt that role's responsibilities and workflow** to complete the task
4. **Switch between agents** as needed for multi-step tasks

## Example Workflows

### Creating a New Feature
1. **Architect Agent**: Gathers requirements → Creates EPS/EDS → Designs interfaces → Creates task specifications
2. **Developer Agent**: Receives task → Implements interfaces → Writes code → Creates unit tests
3. **Tester Agent**: Tests implementation → Validates against requirements → Reports bugs or approves
4. **IT Agent**: Packages release → Creates versioned release → Updates documentation

### Fixing a Bug
1. **Tester Agent**: Reproduces bug → Documents in bug report
2. **Developer Agent**: Analyzes issue → Fixes code → Updates tests
3. **Tester Agent**: Verifies fix → Runs regression tests → Approves

### Setting Up Infrastructure
1. **IT Agent**: Analyzes requirements → Sets up build system → Configures environment → Documents setup

## Agent Collaboration

Agents work together through defined handoffs:
- Architect creates specifications for Developer
- Developer delivers implementations to Tester
- Tester provides quality approval to IT
- IT provides infrastructure to all agents

## Modifying Agent Behavior

To customize agent behavior, edit the respective `.md` files in this directory. Each file defines:
- **Role**: The agent's primary function
- **Responsibilities**: What the agent is responsible for
- **Output Locations**: Where the agent stores its work
- **Handoffs & Collaboration**: How the agent interacts with other agents
- **Workflow**: Step-by-step process for completing tasks
- **Activation Triggers**: Keywords and patterns that activate this agent
- **Best Practices**: Guidelines the agent follows

## Documentation

See `CLAUDE.md` in the repository root for comprehensive documentation on the agent system and project structure.
