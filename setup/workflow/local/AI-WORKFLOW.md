# AI-Assisted Agentic Workflow Template (Local-Only Mode)

---

## MANDATORY INSTRUCTIONS FOR AI ASSISTANTS

**CRITICAL**: If you are an AI assistant (Claude, GPT, Gemini, Copilot, Cursor, Windsurf, Continue, Aider, Cody, etc.), you MUST follow these instructions for EVERY user request:

### 0. LLM Provider Configuration (IDE Authentication Only)

**In local-only mode, LLM Provider is only relevant for IDE authentication.**

**For IDE work** (Copilot, Claude Code, Cursor, Windsurf, Continue, Aider, Cody, etc.):
- No LLM_PROVIDER needed - Your AI tool authenticates separately
- No LLM_API_KEY needed - IDE handles authentication
- Start working immediately - Skip provider setup

**Environment Variables (Only if your IDE requires them):**
- `LLM_PROVIDER` - One of: openai, anthropic, gemini, azure, cohere, mistral, copilot
- `LLM_API_KEY` - Required by some IDEs depending on provider
- `AZURE_OPENAI_ENDPOINT` - Only required if LLM_PROVIDER=azure

**Summary**: Most IDE tools handle authentication on their own. Only configure these if your specific tool requires it.

### 1. Reading Order (NO CIRCULAR REFERENCES)

**This file (AI-WORKFLOW.md) is the single entry point.** Read agent files only when this workflow tells you to. Agent files contain role-specific content only -- they do NOT redirect you back here.

```
Reading flow (one-way, no loops):

Tool entry file (CLAUDE.md, .cursorrules, etc.)
    -> AI-WORKFLOW.md (you are here -- workflow, protocols, common rules)
        -> ai-assistants/agents/product-owner-agent.md (when adopting PO role)
        -> ai-assistants/agents/cost-analyst-agent.md  (when adopting Cost Analyst role)
        -> ai-assistants/agents/architect-agent.md     (when adopting Architect role)
        -> ai-assistants/agents/it-agent.md            (when adopting IT Agent role for deps/build)
        -> ai-assistants/agents/developer-agent.md     (when adopting Developer role)
        -> ai-assistants/agents/tester-agent.md        (when adopting Tester role)
```

**Rules:**
- Read each agent file **only when you adopt that role** in the workflow below
- Agent files do NOT send you back to this file -- you have already read it
- All workflow, handover, and common protocols are HERE (not in agent files)

### 1b. Start as Product Owner

- Read `ai-assistants/agents/product-owner-agent.md` for role-specific instructions
- Adopt Product Owner role for requirements gathering
- Never skip straight to coding

### 2. First Task? Customize the Template

**MANDATORY FOR NEW PROJECTS**

When this is the FIRST task in a NEW project, Product Owner MUST:
1. **Read** `ai-assistants/agents/product-owner-agent.md` for detailed steps
2. **Update domain expertise** in ALL agent files (`ai-assistants/agents/*.md`)
3. **Save changes** before creating user story
4. This ensures all agents have project-specific context for their work

**Do NOT skip this step** - agents will not provide relevant guidance without domain expertise.

### 3. Follow the Agent Workflow

```
User Request -> Product Owner (requirements) -> Cost Analyst (estimate cost)
    -> Architect (design) -> IT Agent (install project deps, setup scripts/)
    -> Developer (implement in modules/) -> Tester (validate)
    -> IT Agent (build release artifacts) -> Product Owner (accept & present)
```

**Cost Analyst** is advisory -- consulted after Product Owner and before any expensive operation.

### 4. Never Skip Steps

Even for "simple" tasks, follow the workflow. This ensures quality and documentation.

---

## Overview

This is a **provider-agnostic template** for setting up a multi-agent AI workflow in **local-only mode** (no GitHub, no version control system required). It works with any LLM (Large Language Model) provider and AI coding assistant.

**Supported AI Providers:**
- Anthropic (Claude)
- OpenAI (GPT-4, GPT-4o)
- Azure OpenAI
- Google (Gemini)
- Ollama (Local models)
- Any OpenAI-compatible API

**Compatible AI Coding Tools:**
- Claude Code, GitHub Copilot, Cursor, Windsurf, Continue, Aider, Cody, and more

**This template is designed for non-programmers** who want to leverage AI-assisted development workflows.

## Quick Start

1. **Copy this template** into your project directory
2. **Configure your LLM provider** (see `ai-assistants/provider-setup/README.md`) if your IDE requires it
3. **Start your AI assistant** and describe what you want to build

---

## LLM Provider Setup

See `ai-assistants/provider-setup/README.md` for detailed setup instructions.

### Quick Configuration

```bash
# 1. Copy the config template
cp ai-assistants/provider-setup/config.template.json ai-assistants/provider-setup/config.json

# 2. Set your API key (if your IDE requires it)
# Linux/macOS (add to ~/.bashrc or ~/.zshrc):
export LLM_API_KEY="your-api-key"

# Windows (PowerShell -- add to $PROFILE for persistence):
# $env:LLM_API_KEY = "your-api-key"

# Windows (CMD):
# set LLM_API_KEY=your-api-key

# 3. Start your AI tool
# For Claude Code:
claude

# For Aider (works with multiple providers):
aider --model gpt-4o  # or --model claude-3-opus
```

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
All agents should understand your project's domain to make informed decisions. Update the agent files in `ai-assistants/agents/` to include relevant domain expertise.

---

## Project Structure

```
YourProject/
|-- ai-assistants/               # AI configuration
|   |-- agents/                  # Agent role definitions
|   |   |-- product-owner-agent.md    # Requirements lead and backlog manager
|   |   |-- it-agent.md              # Infrastructure specialist
|   |   |-- architect-agent.md       # System designer
|   |   |-- developer-agent.md       # Implementation specialist
|   |   |-- cost-analyst-agent.md    # Cost estimation specialist
|   |   +-- tester-agent.md          # QA specialist
|   |-- provider-setup/          # LLM provider configuration
|   |   |-- config.template.json     # Config template
|   |   |-- config.json              # Your config
|   |   +-- README.md                # Setup instructions
|   +-- how-to-use.md            # Getting started guide
|
|-- project-management/          # Project documentation
|   |-- tasks/                   # Task management system
|   |-- designs/                 # Architecture docs (EPS, EDS)
|   |-- requirements/            # Feature requirements
|   |-- quality/                 # Test plans and QA docs
|   |-- operations/              # Infrastructure and releases
|   +-- workflow/                # Team coordination docs
|
|-- modules/                     # Software modules
|   |-- module-name/             # Each module is self-contained
|   |   |-- src/                 # Module source code
|   |   |-- test/                # Module tests
|   |   |-- release/             # Module release output
|   |   |-- debug/               # Module debug output
|   |   |-- build-config/        # Build configuration
|   |   +-- Makefile             # Module build script
|   +-- another-module/          # Add more modules as needed
|
|-- output/                      # Combined build output
|   |-- release/                 # Combined release (all modules)
|   +-- debug/                   # Combined debug (all modules)
|
|-- scripts/                     # Build, test, run scripts
|   |-- build.sh                 # Build all modules
|   |-- test.sh                  # Run all tests
|   |-- run.sh                   # Run the application
|   +-- clean.sh                 # Clean build artifacts
|
|-- Makefile                     # Top-level build script
|-- AI-WORKFLOW.md               # This file
+-- README.md                    # Project readme
```

---

## Agent System

This template uses a **multi-agent system** where the AI assistant adopts specialized roles based on the task. The agents work together through a structured workflow.

### Agent Roles

#### Product Owner Agent
**Role**: Customer-Facing Requirements Lead and Backlog Manager

- **ALWAYS activates first** for new user requests
- Gathers and clarifies user requirements
- Creates high-level user stories (WHAT to build, not HOW)
- Coordinates work across all agents
- Accepts completed work

**Activates for**: Any new task from user, requirements, prioritization

**Note**: Product Owner focuses on WHAT to build. Technical details are filled in by Architect.

#### Architect Agent
**Role**: System Architect and Design Lead

- Enriches user stories with technical specifications
- Designs interfaces and APIs
- Creates detailed development tasks
- Makes architectural decisions

**Activates for**: New features, specifications, design, architecture

**Note**: Architect creates *technical specifications*. Product Owner creates *high-level requirements*.

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

#### IT Agent
**Role**: Infrastructure and Operations Specialist

- **Installs project dependencies** based on Architect's tech stack (e.g., Node.js, Python, Rust)
- Maintains build infrastructure
- Manages releases and versioning (local file-based releases)
- Sets up build scripts in `scripts/`
- Documents infrastructure

**Activates for**: Build systems, releases, infrastructure, project dependency installation

**What IT Agent does in local-only mode:**

1. **Detects OS** (Linux, macOS, Windows)
2. **Detects/installs package manager**:
   - Linux: `apt-get`, `dnf`, `yum`, `pacman`, `apk`, `zypper` (all major distros)
   - macOS: Installs Homebrew automatically if missing
   - Windows: Uses `winget` if available, otherwise auto-installs Chocolatey
3. **Installs project-specific tools** from Architect's tech stack (Node.js, Python, Rust, etc.)
4. **Sets up build scripts** in `scripts/`
5. **Builds release artifacts** into `output/`

```bash
# Quick reference - IT Agent runs these steps automatically:

# Step 0: Detect OS and package manager
OS_TYPE="$(uname -s)"  # Linux, Darwin, MINGW/MSYS/CYGWIN

# Step 1: Detect package manager (apt-get/dnf/yum/pacman/apk/zypper/brew/winget/choco)
# Step 2: Install project-specific tools from Architect's tech stack
# Step 3: Set up build scripts in scripts/
# Step 4: Final verification of all tools

# See it-agent.md for complete cross-platform scripts
```

**The general principle**: If a tool is needed to install project dependencies (e.g., `npm` needs `node`, `pip` needs `python`, `cargo` needs `rust`), IT Agent MUST install that tool first. Never assume tools are pre-installed on the user's machine.

#### Cost Analyst Agent
**Role**: Resource Analyst and Cost Optimization Specialist (ADVISORY)

- **Runs after Product Owner** creates the user story -- estimates total task cost
- Estimates token consumption before expensive operations
- Warns user before high-cost tasks (> $1.00 requires explicit approval)
- Logs usage for transparency
- Recommends cost optimization strategies
- **Does NOT create deliverables** -- reports estimates back to Product Owner/user

**Activates for**: After every user story (mandatory), before expensive operations (any agent can request), cost estimation, usage reporting

### Agent Workflow

The agents work together in a collaborative workflow:

```
User Request
    |
    v
Read ai-assistants/agents/product-owner-agent.md -> Product Owner (requirements)  <-- FIRST
    |
    v
Read ai-assistants/agents/cost-analyst-agent.md -> Cost Analyst (estimate cost)  <-- ADVISORY
    |
    v
Read ai-assistants/agents/architect-agent.md -> Architect (design)
    |
    v
Read ai-assistants/agents/it-agent.md -> IT Agent (install deps, setup scripts/)
    |
    v
Read ai-assistants/agents/developer-agent.md -> Developer (implement in modules/)
    |
    v
Read ai-assistants/agents/tester-agent.md -> Tester (validate)
    |
    v
Read ai-assistants/agents/it-agent.md -> IT Agent (build release artifacts)
    |
    v
Read ai-assistants/agents/product-owner-agent.md -> Product Owner (accept & present)
```

**IMPORTANT**:
- **Product Owner runs FIRST**: Gathers requirements and creates the user story before any other work begins.
- **IT Agent activates TWICE**: After Architect (project dependency setup) and before Release (build artifacts).
- **Cost Analyst is ADVISORY**: Consulted after Product Owner creates the user story. Also consulted by any agent before expensive operations (> $1.00). Does NOT create deliverables -- reports cost estimates back to Product Owner for go/no-go decision.

### MANDATORY HANDOVER PROTOCOL (ALL AGENTS)

**CRITICAL: This is a BLOCKING GATE. Every agent MUST complete this before the next agent starts.**

When an agent finishes their work and is ready to hand over to the next agent:

1. **STOP** - Do not proceed to the next agent role yet
2. **Save all work** - Ensure all files are saved
3. **Provide handover context** -- the outgoing agent MUST document:
   - What was completed
   - Key decisions made and why
   - Any open questions or known issues
   - What the next agent needs to know
4. **Ask the user**:
   > "My work as [Agent Name] is complete. Would you like to review my work before I hand over to [Next Agent]?"
5. **Wait for user response** - Do NOT assume the answer
6. **If user wants to review**: Present a summary of all work completed, files created/modified, and decisions made. Wait for user approval before proceeding.
7. **If user says continue**: Proceed to the next agent role

**When the NEXT agent starts, it MUST** (see [Task Analysis & Collaboration Protocol](#task-analysis--collaboration-protocol)):
- Read the handover context from the previous agent
- Ask clarifying questions about anything unclear (**What**, **Why**, **How**, **Scope**, **Dependencies**, **Success Criteria**)
- The previous agent (or user) MUST answer these questions before work begins
- Document understanding and assumptions before starting work

**NEVER silently skip this step.** The user MUST be consulted at every handover.

**Why this matters**: Without this gate, agents skip review entirely, potentially building on incorrect assumptions. This was the #1 observed failure mode during testing.

#### Handover Points in the Workflow

| Completing Agent | Next Agent | Handover Gate |
|-----------------|------------|---------------|
| Product Owner | Cost Analyst | No gate -- Cost Analyst reviews the user story |
| Cost Analyst | Architect | Reports cost estimate to user. If approved, continue to Architect |
| Architect | IT Agent (setup) | Ask user: review or continue? |
| IT Agent (setup) | Developer | Ask user: review or continue? |
| Developer | Tester | Ask user: review or continue? |
| Tester | IT Agent (release) | Ask user: review or continue? |
| IT Agent (release) | Product Owner | Ask user: review or continue? |

**Note**: Cost Analyst can also be consulted mid-workflow by any agent before expensive operations. Any agent can request a cost estimate; Cost Analyst reports back to the requesting agent and the user.

---

## Task Management

### Task Folders

- `project-management/tasks/backlog/` - User stories (Product Owner)
- `project-management/tasks/it/` - Infrastructure tasks
- `project-management/tasks/architect/` - Design tasks
- `project-management/tasks/developer/` - Implementation tasks
- `project-management/tasks/tester/` - Testing tasks

### Creating Tasks

1. Copy `TEMPLATE.md` to new file
2. Fill in objective, requirements, deliverables
3. Set status and priority
4. Tell your AI assistant to process the task

### Task Lifecycle

```
pending -> in-progress -> completed -> archived
              |
           blocked
```

---

## Development Guidelines

### Code Organization
- Organize code into self-contained modules in `modules/`
- Each module contains:
  - `src/` - Module source code
  - `test/` - Module tests
  - `release/` - Release build output
  - `debug/` - Debug build output
  - `build-config/` - Build configuration files
  - `Makefile` - Module build script
- Copy `modules/example-module/` to create new modules

### Working Directory
- Work directly in the project directory
- Save files as you go
- No branching or version control required in local-only mode

### Testing Strategy

**Test Levels**:
1. **Unit Tests** (Developer) - Individual functions/classes
2. **Component Tests** (Tester) - Components in isolation
3. **Integration Tests** (Tester) - Component interactions
4. **System Tests** (Tester) - End-to-end workflows

---

## Customization Guide

### 1. Configure Your LLM Provider

Edit `ai-assistants/provider-setup/config.json` with your provider settings. See `ai-assistants/provider-setup/README.md` for details.

### 2. Update Domain Expertise

Edit each agent file in `ai-assistants/agents/` to include your project's domain knowledge.

### 3. Customize Project Structure

Modify the directory structure to match your project's needs:
- Add source directories for your modules
- Configure build systems for your technology stack
- Set up test directories appropriate for your frameworks

### 4. Configure Build System

Add build scripts appropriate for your technology:
- Makefiles for C/C++ projects
- package.json for Node.js
- requirements.txt for Python
- build.gradle for Java

---

## Using with Different AI Tools

### Claude Code (Example Tool)
```bash
npm install -g @anthropic-ai/claude-code

# Linux/macOS:
export ANTHROPIC_API_KEY="your-key"
# Windows (PowerShell): $env:ANTHROPIC_API_KEY = "your-key"

cd your-project
claude  # or use your preferred AI tool
```

### Aider
```bash
pip install aider-chat

# Linux/macOS:
export OPENAI_API_KEY="your-key"  # or ANTHROPIC_API_KEY
# Windows (PowerShell): $env:OPENAI_API_KEY = "your-key"

cd your-project
aider
```

### Cursor
1. Download from cursor.sh
2. Open your project
3. Use Cmd/Ctrl+K for AI assistance

### Windsurf
1. Download from codeium.com/windsurf
2. Open your project
3. Use AI chat panel -- reads `.windsurfrules` automatically

### Continue (VS Code)
1. Install Continue extension
2. Configure your API key
3. Use the Continue panel -- reads `.continuerules` automatically

### GitHub Copilot
1. Install GitHub Copilot extension in VS Code
2. Sign in with your GitHub account
3. Enable instruction files in `.vscode/settings.json` (already configured in this template)
4. Use Copilot Chat -- reads `.github/copilot-instructions.md` automatically

---

## Notes for AI Assistants

- Automatically adopt appropriate agent role based on task
- Read agent file in `ai-assistants/agents/` **only when adopting that role** (not upfront)
- Document decisions in appropriate project-management folders
- Keep this file updated when structure changes
- API keys are stored as environment variables, never in code

---

## Getting Started

1. **Configure your AI provider** (see `ai-assistants/provider-setup/README.md`) if your IDE requires it
2. **Describe your project** to the AI assistant
3. The AI will ask clarifying questions
4. Work begins with Product Owner analysis
5. Agents collaborate to complete the work
6. Review the completed output

**Example first request**:
"I want to build a web application for managing tasks. It should have user authentication, task creation, and notifications."

---

## Security Best Practices

- **Never store API keys in project files** - Use environment variables
- **Rotate keys regularly** - Especially if accidentally exposed
- **Use least privilege** - Only grant necessary API permissions

---

## Common Agent Protocols

**All agents MUST follow these protocols. Individual agent files reference this section instead of duplicating it.**

### Task Analysis & Collaboration Protocol

**CRITICAL -- MANDATORY AT EVERY HANDOVER**: When an agent receives work from another agent (or from the user), it MUST follow this protocol BEFORE starting any implementation. The handing-over agent (or user) MUST answer the receiving agent's questions.

#### 1. Task Analysis & Clarification (MANDATORY)
When receiving a handover or new task, ALWAYS:

- **Read the handover context**: What did the previous agent complete? What decisions were made?
- **Read & Understand**: Carefully read the task description, requirements, and acceptance criteria
- **Ask Clarifying Questions** -- the receiving agent MUST ask, and the handing-over agent/user MUST answer:
  - **What**: What exactly needs to be built/changed?
  - **Why**: What is the purpose and business value?
  - **How**: Are there specific approaches or constraints?
  - **Scope**: What is in-scope vs out-of-scope?
  - **Dependencies**: What does this depend on? What depends on this?
  - **Success Criteria**: How will we know this is done correctly?
- **Do NOT proceed until questions are answered** -- if answers are unclear, ask again

#### 2. Document Understanding
Record in the appropriate `project-management/` subfolder:
- Task understanding and interpretation
- Key decisions and rationale
- Assumptions made
- Risks identified

#### 3. Think Critically Before Implementing
- **Identify Flaws**: Look for potential issues, edge cases, or problems
- **Suggest Improvements**: Propose better approaches or alternatives
- **Consider Trade-offs**: Analyze pros/cons of different approaches
- **Long-term Impact**: Consider maintainability and scalability

#### 4. Collaborate with Other Agents
- **Share Analysis**: Document findings and questions
- **Request Input**: Ask relevant agents for their perspective
- **Reach Consensus**: Ensure agreement on approach before proceeding
- **Document Agreement**: Record the agreed-upon approach

#### 5. Get Approval Before Significant Work
- Present the refined plan to the user
- Confirm understanding and approach
- Get explicit go-ahead

#### 6. Execute with Documentation
- Follow the agreed-upon plan
- Document significant decisions as you go
- Note any deviations from the plan and why

**Why this matters**: Without this protocol, agents make assumptions, build the wrong thing, or miss requirements. Asking clarifying questions catches misunderstandings early -- before code is written.

### Before Concluding Any Task (ALL AGENTS)

**CRITICAL**: Before marking a task as complete, ALWAYS:

1. **Save your work**: Ensure all files are saved
2. **Follow the [Handover Protocol](#mandatory-handover-protocol-all-agents)**: Ask user if they want to review
3. **Update task status**: Mark task as completed in the task file

---

**Template Version**: 2.2-local
**Last Updated**: 2026-02-07
