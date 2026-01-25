# AI Agent System

This directory contains agent role definitions for the multi-agent workflow. These definitions work with **any LLM provider** and **any AI coding tool**.

## Supported AI Tools

| Tool | Provider(s) | Setup |
|------|-------------|-------|
| Aider | OpenAI, Anthropic, Ollama | Configure in `.aider.conf.yml` |
| Cursor | OpenAI, Anthropic | Add to `.cursorrules` |
| Continue | Multiple | Reference in system prompt |
| Any CLI | Any provider | Read these files as context |

## Agent Files

- **`team-leader-agent.md`**: Task Orchestrator - plans and coordinates work
- **`it-agent.md`**: Infrastructure Agent - manages builds, releases, CI/CD
- **`architect-agent.md`**: Design Agent - creates specifications and designs
- **`developer-agent.md`**: Implementation Agent - writes code and tests
- **`tester-agent.md`**: QA Agent - validates quality and reports bugs

## How It Works

1. **AI reads agent definitions** from this directory
2. **Analyzes your request** to understand the task type
3. **Adopts the appropriate agent role** based on activation triggers
4. **Follows that role's responsibilities and workflow**
5. **Hands off to other agents** as needed

## Example Workflows

### Creating a New Feature
1. **Team Leader**: Analyzes request → Plans breakdown → Assigns agents
2. **Architect**: Creates EPS/EDS → Designs interfaces → Creates tasks
3. **Developer**: Implements code → Writes unit tests
4. **Tester**: Validates → Reports issues → Approves
5. **IT**: Creates release

### Fixing a Bug
1. **Tester**: Documents bug report
2. **Developer**: Fixes code → Updates tests
3. **Tester**: Verifies fix → Approves

### Setting Up Infrastructure
1. **IT Agent**: Sets up build system → Configures CI/CD → Documents

## Agent Collaboration

Agents work together through handoffs:
- **Team Leader** coordinates all agents
- **Architect** creates specs for Developer
- **Developer** delivers to Tester
- **Tester** approves for IT
- **IT** provides infrastructure to all

## Customizing for Your AI Tool

### For Aider
Add to `.aider.conf.yml`:
```yaml
read:
  - ai-assistants/agents/team-leader-agent.md
  - ai-assistants/agents/architect-agent.md
  - ai-assistants/agents/developer-agent.md
  - ai-assistants/agents/tester-agent.md
  - ai-assistants/agents/it-agent.md
```

### For Cursor
Add to `.cursorrules`:
```
Read and follow the agent role definitions in the ai-assistants/agents/ directory.
When working on tasks, adopt the appropriate agent role based on the task type.
```

### For Other Tools
Include agent files as context or system prompts.

## Modifying Agent Behavior

Edit the `.md` files to customize:
- **Role**: Agent's primary function
- **Domain Expertise**: Your project's domain knowledge (CUSTOMIZE THIS)
- **Responsibilities**: What the agent does
- **Output Locations**: Where work is stored
- **Handoffs**: How agents interact
- **Workflow**: Step-by-step processes
- **Activation Triggers**: When to use this agent

## Domain Customization

Each agent has a section marked:
```
**CUSTOMIZE THIS SECTION**
```

Replace with your project's domain expertise (healthcare, finance, e-commerce, etc.).

## Documentation

See `AI-WORKFLOW.md` for full workflow documentation.
