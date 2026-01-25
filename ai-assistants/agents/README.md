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

- **`project-manager-agent.md`**: Client-Facing Project Lead - coordinates work and manages user communication
- **`architect-agent.md`**: Design Agent - creates specifications, designs, and technical tasks
- **`developer-agent.md`**: Implementation Agent - writes code and unit tests
- **`tester-agent.md`**: QA Agent - validates quality and reports bugs
- **`it-agent.md`**: Infrastructure Agent - manages builds, releases, CI/CD
- **`cost-analyst-agent.md`**: Resource Analyst - estimates token costs and warns before expensive operations

## How It Works

1. **AI reads agent definitions** from this directory
2. **Analyzes your request** to understand the task type
3. **Adopts the appropriate agent role** based on activation triggers
4. **Follows that role's responsibilities and workflow**
5. **Hands off to other agents** as needed

## Role Clarification

| Role | Primary Responsibility |
|------|------------------------|
| **Project Manager** | User communication, coordination, assigns work to agents |
| **Architect** | Technical design, specifications, creates detailed tasks |
| **Developer** | Code implementation, unit testing |
| **Tester** | Quality validation, test planning, bug reporting |
| **IT** | Build systems, releases, infrastructure |
| **Cost Analyst** | Token estimation, cost warnings, usage tracking |

## Example Workflows

### Creating a New Feature
1. **Project Manager**: Receives request → Clarifies with user → Assigns to Architect
2. **Architect**: Creates EPS/EDS → Designs interfaces → Creates technical tasks
3. **Project Manager**: Assigns implementation tasks to Developer
4. **Developer**: Implements code → Writes unit tests
5. **Tester**: Validates → Reports issues → Approves
6. **IT**: Creates release

### Fixing a Bug
1. **Project Manager**: Receives bug report → Assigns investigation
2. **Tester**: Documents bug details
3. **Developer**: Fixes code → Updates tests
4. **Tester**: Verifies fix → Approves

### Expensive Operation
1. **Cost Analyst**: Estimates token usage for task
2. **Cost Analyst**: Warns user if cost exceeds threshold
3. **User**: Approves or modifies scope
4. **Agents**: Proceed with work

## Agent Collaboration

Agents work together through handoffs:
- **Project Manager** coordinates all agents and user communication
- **Architect** creates specs and technical tasks
- **Developer** implements based on Architect's specs
- **Tester** validates Developer's work
- **IT** provides infrastructure to all
- **Cost Analyst** monitors resource usage across all agents

## Customizing for Your AI Tool

### For Aider
Add to `.aider.conf.yml`:
```yaml
read:
  - ai-assistants/agents/project-manager-agent.md
  - ai-assistants/agents/architect-agent.md
  - ai-assistants/agents/developer-agent.md
  - ai-assistants/agents/tester-agent.md
  - ai-assistants/agents/it-agent.md
  - ai-assistants/agents/cost-analyst-agent.md
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
