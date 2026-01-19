# Claude Code Project Guide

## Project Overview

**BigProjPOC** is a proof-of-concept project organized into multiple large modules. This document provides context and guidelines for Claude Code to effectively assist with development.

## Project Structure

```
BigProjPOC/
├── .claude/                 # Claude Code configuration
│   ├── agents/             # Agent role definitions
│   │   ├── it-agent.md          # IT/Infrastructure agent
│   │   ├── architect-agent.md   # Architect agent
│   │   ├── developer-agent.md   # Developer agent
│   │   └── tester-agent.md      # Tester/QA agent
│   ├── settings.json       # Project settings and preferences
│   └── prompts/            # Custom prompts (if needed)
├── BigModuleA/             # Module A
│   ├── src/                # Source code
│   │   └── ext/interfaces/ # External interfaces
│   ├── tests/              # Test suites
│   │   ├── unit/           # Unit tests (by Developer)
│   │   ├── component/      # Component tests (by Tester)
│   │   ├── integration/    # Integration tests (by Tester)
│   │   └── system/         # System tests (by Tester)
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── BigModuleB/             # Module B
│   ├── src/                # Source code
│   │   └── ext/interfaces/ # External interfaces
│   ├── tests/              # Test suites
│   │   ├── unit/           # Unit tests (by Developer)
│   │   ├── component/      # Component tests (by Tester)
│   │   ├── integration/    # Integration tests (by Tester)
│   │   └── system/         # System tests (by Tester)
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── BigModuleC/             # Module C
│   ├── src/                # Source code
│   │   └── ext/interfaces/ # External interfaces
│   ├── tests/              # Test suites
│   │   ├── unit/           # Unit tests (by Developer)
│   │   ├── component/      # Component tests (by Tester)
│   │   ├── integration/    # Integration tests (by Tester)
│   │   └── system/         # System tests (by Tester)
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── docs/                   # Project documentation
│   ├── tasks/              # Task management system
│   │   ├── it/             # Tasks for IT Agent
│   │   ├── architect/      # Tasks for Architect Agent
│   │   ├── developer/      # Tasks for Developer Agent
│   │   └── tester/         # Tasks for Tester Agent
│   ├── architecture/       # Architecture docs (by Architect)
│   │   ├── eps/            # External Product Specifications
│   │   ├── eds/            # External Design Specifications
│   │   ├── interfaces/     # Interface specifications
│   │   ├── tasks/          # Development tasks (created by Architect)
│   │   └── decisions/      # Architecture Decision Records
│   ├── requirements/       # Requirements docs (by Architect)
│   │   ├── functional/     # Functional requirements
│   │   └── non-functional/ # Non-functional requirements
│   ├── tests/              # Test documentation (by Tester)
│   │   ├── plans/          # Test plans
│   │   ├── reports/        # Test reports
│   │   ├── bugs/           # Bug reports
│   │   └── documentation/  # Test documentation
│   └── it/                 # IT documentation (by IT)
│       ├── build/          # Build system docs
│       ├── releases/       # Release management docs
│       ├── environment/    # Environment setup
│       └── infrastructure/ # Infrastructure docs
├── release/                # Repository-level release artifacts
└── CLAUDE.md               # This file - project guide for Claude Code

```

## Modules

### BigModuleA
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

### BigModuleB
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

### BigModuleC
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

## Agent System

This project uses a multi-agent system where Claude Code automatically adopts different specialized roles based on the task at hand. The agent configurations are located in `.claude/agents/`.

### Agent Roles

#### 0. Team Leader Agent (`.claude/agents/team-leader-agent.md`) 🎯
**Role**: Technical Leader and Task Orchestrator

**Responsibilities**:
- Analyze incoming tasks and user requirements
- Break down complex tasks into manageable subtasks
- Review all agents' capabilities and past experiences
- Match tasks to the most appropriate agent(s)
- Assign tasks with clear specifications and context
- Coordinate multi-agent work when needed
- Monitor progress and remove blockers
- Document planning decisions in `docs/team-leader/`

**Automatically activates for**:
- New task or requirement from user (ALWAYS activates first)
- Task planning or breakdown requests
- Multi-agent coordination needed
- Complex tasks requiring orchestration
- Questions like "who should do this?" or "how should we approach this?"

**Key Feature**: Acts as the orchestration layer, ensuring the right agent(s) work on the right tasks at the right time.

#### 1. IT Agent (`.claude/agents/it-agent.md`)
**Role**: Infrastructure and Operations Specialist

**Responsibilities**:
- Maintain repository structure and build infrastructure
- Set up and maintain build systems across all modules
- Manage versioned releases in `release/` directory
- Install and maintain common tools and software
- Create and maintain CI/CD pipelines
- Document infrastructure in `docs/it/`

**Automatically activates for**:
- Setting up build systems or infrastructure
- Creating releases or versioning
- Installing or updating tools
- Repository structure changes

#### 2. Architect Agent (`.claude/agents/architect-agent.md`)
**Role**: System Architect and Design Lead

**Responsibilities**:
- Gather and document requirements in `docs/requirements/`
- Create and maintain External Product Specifications (EPS) in `docs/architecture/eps/`
- Create and maintain External Design Specifications (EDS) in `docs/architecture/eds/`
- Design interfaces and create specifications in `docs/architecture/interfaces/`
- Create development tasks for Developer agent in `docs/architecture/tasks/`
- Make architectural decisions and document them

**Automatically activates for**:
- Creating new features or systems
- Writing requirements or specifications
- Designing interfaces or APIs
- Creating architecture documentation
- Planning development tasks

#### 3. Developer Agent (`.claude/agents/developer-agent.md`)
**Role**: Software Developer and Implementation Specialist

**Responsibilities**:
- Implement interfaces in `<module>/src/ext/interfaces/` as specified by Architect
- Implement features based on task specifications
- Write clean, maintainable code
- Write comprehensive unit tests in `<module>/tests/unit/`
- Document code appropriately
- Follow coding standards and best practices

**Automatically activates for**:
- Implementing features or functionality
- Creating or modifying interfaces
- Writing code
- Fixing bugs
- Writing unit tests
- Code refactoring

#### 4. Tester Agent (`.claude/agents/tester-agent.md`)
**Role**: Quality Assurance and Testing Specialist

**Responsibilities**:
- Create test plans in `docs/tests/plans/`
- Write component tests in `<module>/tests/component/`
- Write integration tests in `<module>/tests/integration/`
- Write system tests in `<module>/tests/system/`
- Validate implementations against requirements
- Report bugs in `docs/tests/bugs/`
- Create test reports in `docs/tests/reports/`
- Approve releases based on quality gates

**Automatically activates for**:
- Testing features or implementations
- Creating test plans or test cases
- Validating functionality
- Writing automated tests
- Reporting bugs or issues
- Performing quality assurance

### Agent Workflow

The agents work together in a collaborative workflow orchestrated by the Team Leader:

**0. Orchestration** (Team Leader) - **ALWAYS FIRST**
   - Analyze user request → Review agent capabilities → Plan task breakdown → Assign to appropriate agent(s) → Monitor & coordinate

**Simple Task (Single Agent):**
1. **Team Leader** → Analyze → Assign to best agent → Monitor → Complete

**Complex Task (Multiple Agents):**
1. **Task Planning** (Team Leader)
   - Analyze request → Break down → Plan dependencies → Create tasks for each agent

2. **Requirements & Design** (Architect)
   - Gather requirements → Create EPS/EDS → Design interfaces → Create tasks

3. **Implementation** (Developer)
   - Receive task from Architect → Implement interfaces → Write code → Write unit tests

4. **Testing** (Tester)
   - Receive implementation from Developer → Test functionality → Report bugs or approve

5. **Release** (IT)
   - Receive approved features → Create release → Package artifacts → Update documentation

6. **Coordination** (Team Leader)
   - Monitor progress → Remove blockers → Facilitate communication → Keep user informed

### Agent Handoffs

Agents automatically hand off work to each other, coordinated by Team Leader:
- **User → Team Leader**: Task requests and requirements
- **Team Leader → Architect**: Design and specification tasks
- **Team Leader → Developer**: Implementation tasks (with context)
- **Team Leader → Tester**: Testing and validation tasks
- **Team Leader → IT**: Infrastructure and release tasks
- **Architect → Developer**: Task specifications and interface designs
- **Developer → Tester**: Implemented features ready for testing
- **Tester → Developer**: Bug reports (feedback loop)
- **Tester → IT**: Approval for release
- **IT → All**: Infrastructure and build system updates
- **All → Team Leader**: Progress updates, blockers, questions

### How It Works

Claude Code **automatically determines which agent role to use** based on your request. You don't need to explicitly specify which agent to invoke - the system intelligently selects the appropriate agent(s) based on the task.

**Example**:
- "Create a user authentication feature" → Activates **Architect** to design, then **Developer** to implement, then **Tester** to validate
- "Fix the build script" → Activates **IT Agent**
- "Test the login functionality" → Activates **Tester Agent**
- "Implement the IAuthService interface" → Activates **Developer Agent**

### Task Analysis & Collaboration Protocol

**All agents follow a rigorous task analysis and collaboration protocol before executing work:**

#### 1. Analyze & Clarify First
Before starting any task, agents will:
- **Ask Questions**: Clarify the what, why, how, scope, dependencies, and success criteria
- **Document Understanding**: Record task interpretation, decisions, assumptions, and risks
- **Think Like an Architect**: Identify flaws, suggest improvements, consider trade-offs and long-term impact

#### 2. Propose Alternatives
Agents will:
- **Brainstorm Solutions**: Consider multiple approaches to solve the problem
- **Suggest Improvements**: Propose better options, optimizations, or enhancements
- **Identify Issues Early**: Flag potential problems, edge cases, or design flaws

#### 3. Collaborate & Reach Consensus
Before implementation:
- **Share Analysis**: Agents document their findings and questions
- **Request Input**: Seek perspective from other relevant agents:
  - Architect for design implications
  - Developer for implementation feasibility
  - Tester for testability and quality
  - IT for infrastructure and build system impacts
- **Brainstorm Together**: Engage in collaborative problem-solving
- **Reach Agreement**: All agents agree on the approach before proceeding
- **Document Decisions**: Record the agreed-upon approach and rationale

#### 4. Get Approval & Execute
- Present the refined plan to the user
- Confirm understanding and approach
- Get explicit go-ahead
- Execute with documentation
- Update progress throughout

#### Memory & Learning
Agents maintain decision logs in their respective documentation folders:
- **IT Agent**: `docs/it/decisions/`
- **Architect Agent**: `docs/architecture/decisions/`
- **Developer Agent**: `docs/architecture/tasks/` or code comments
- **Tester Agent**: `docs/tests/documentation/`

This ensures important context is preserved for future feature discussions and architectural reasoning.

#### Protocol Workflow

```
Task Received
    ↓
Analyze & Ask Questions
    ↓
Document Understanding
    ↓
Think & Identify Issues
    ↓
Suggest Alternatives
    ↓
Collaborate with Agents
    ↓
Brainstorm & Refine
    ↓
Reach Agreement
    ↓
Document Plan
    ↓
Get User Approval
    ↓
Execute
    ↓
Document Results
    ↓
Complete
```

### Task Management System

The project uses a centralized task management system in `docs/tasks/` where you can create tasks for any agent.

#### Task Folders

- `docs/tasks/it/` - Tasks for IT Agent (build setup, releases, infrastructure)
- `docs/tasks/architect/` - Tasks for Architect Agent (design, requirements, specifications)
- `docs/tasks/developer/` - Tasks for Developer Agent (direct implementation tasks)
- `docs/tasks/tester/` - Tasks for Tester Agent (testing, validation, QA)

**Note**: Architect Agent also creates tasks for Developer in `docs/architecture/tasks/` as part of the design workflow.

#### Creating Tasks

1. Go to the appropriate agent's task folder
2. Copy `TEMPLATE.md` to a new file with a descriptive name
3. Fill in all sections (objective, requirements, deliverables, etc.)
4. Set status to `pending` and priority (high/medium/low)
5. Save the file

#### Triggering Agents

After creating a task, tell Claude:
- `"Check for new tasks in docs/tasks/"`
- `"Work on IT tasks"` or `"Process [agent-name] tasks"`
- `"I've added a task in docs/tasks/it/setup-build.md"`

Claude will automatically:
1. Detect which agent the task is for
2. Adopt that agent role
3. Process the task
4. Update status to `in-progress` → `completed`
5. Complete the work and document results

#### Task Lifecycle

```
pending → in-progress → completed → archived
              ↓
           blocked (if issues arise)
```

See `docs/tasks/README.md` for complete documentation on the task management system.

## Development Guidelines

### Code Organization
- Keep module code contained within respective `src/` directories
- Build and release directories are excluded from version control
- Maintain separation of concerns between modules

### Build Process
- Build artifacts should be generated in module-specific `build/` directories
- Module-specific releases should be created in module-specific `release/` directories
- Repository-level releases should be placed in the root `release/` directory

### Git Workflow
- Main branch: `master`
- Feature branches: Use `claude/` prefix for Claude-generated work
- Always test changes before committing

## Claude Code Instructions

### CRITICAL: Keeping This File Updated
**ALWAYS update this CLAUDE.md file whenever:**
- Project structure changes (new folders, renamed directories, reorganization)
- New modules or components are added
- Folders are renamed or moved
- Build/release processes change
- New conventions or patterns are established
- Any explanations need to be added or clarified

This file is the source of truth for the project structure and must stay current.

### When Creating New Features
1. Analyze existing code structure before making changes
2. Follow the established patterns in each module
3. Update relevant documentation (especially this CLAUDE.md file if structure changes)
4. Consider impacts across all three modules if making architectural changes

### When Debugging
1. Check all three modules for related issues
2. Review build and release outputs if errors occur
3. Maintain consistency across modules

### Testing Strategy

The project follows a comprehensive testing strategy managed by the **Tester Agent**:

**Test Levels**:
1. **Unit Tests** (by Developer Agent)
   - Located in `<module>/tests/unit/`
   - Test individual functions and classes
   - Written alongside implementation

2. **Component Tests** (by Tester Agent)
   - Located in `<module>/tests/component/`
   - Test individual components in isolation
   - Verify component interfaces

3. **Integration Tests** (by Tester Agent)
   - Located in `<module>/tests/integration/`
   - Test component interactions
   - Verify data flow between components

4. **System Tests** (by Tester Agent)
   - Located in `<module>/tests/system/`
   - End-to-end testing
   - Validate against requirements

**Test Documentation**:
- Test plans: `docs/tests/plans/`
- Test reports: `docs/tests/reports/`
- Bug reports: `docs/tests/bugs/`

## Common Tasks

### Building the Project
Handled by **IT Agent**:
- Each module has a Makefile with standardized build targets
- Build system uses common infrastructure from `common_infra/build_tools/`
- Detailed documentation in `docs/it/build/module-build-system.md`

**Quick Start:**
```bash
# Navigate to any module
cd BigModuleA

# View available targets
make help

# Generate C++ from Thrift files
make generate

# Build debug and release versions
make build

# Clean build artifacts
make clean

# Install to repository release/ folder
make install
```

**Build Targets:**
- `make all` - Generate and build everything (default)
- `make generate` - Generate C++ code from Thrift interface files
- `make build` - Build both debug and release versions
- `make build-debug` - Build debug version only
- `make build-release` - Build release version only
- `make clean` - Remove all build artifacts
- `make install` - Install built artifacts to repository `release/` folder

**Build Workflow:**
1. Developer creates `.thrift` file in `src/ext/interfaces/`
2. Run `make generate` to create C++ files in `src/int/generated/`
3. Developer implements interfaces in `src/int/impl/`
4. Run `make build` to compile everything
5. Run `make install` to install artifacts to `release/`

**Build Outputs:**
- Debug builds:
  - Executable: `build/debug/BigModuleX`
  - Library: `build/debug/libBigModuleX.a`
- Release builds:
  - Executable: `build/release/BigModuleX`
  - Library: `build/release/libBigModuleX.a`
- Generated code: `src/int/generated/`
- Installed artifacts: `release/bin/`, `release/lib/`, `release/include/`

### Running Tests
Handled by **Tester Agent**:
- Run unit tests: Developer's responsibility
- Run component/integration/system tests: Tester's responsibility
- Test documentation in `docs/tests/`

### Creating Releases
Handled by **IT Agent**:
1. Create versioned folder in `release/v<version>/`
2. Package artifacts from module release folders
3. Generate release notes
4. Tag release in git
5. Update documentation in `docs/it/releases/`

### Creating Features
Multi-agent workflow:
1. **Architect**: Gather requirements → Design → Create tasks
2. **Developer**: Implement → Write unit tests
3. **Tester**: Test → Validate → Approve
4. **IT**: Release → Package → Deploy

## Notes for Claude

- This is a multi-module project - changes may affect multiple modules
- Build and release directories are working directories, not source code
- Maintain consistency in structure and patterns across all modules
- Ask clarifying questions when requirements are ambiguous
- Use plan mode for complex, multi-step changes
- **Agent System**: Automatically adopt the appropriate agent role based on the task
  - Read agent configurations in `.claude/agents/` to understand responsibilities
  - Switch between agent roles as needed during multi-step tasks
  - Follow the agent workflow for feature development
  - Ensure proper handoffs between agents

## GitHub Authentication and PR Creation

### Authentication Setup

The repository uses a GitHub personal access token stored in `.github_token` for automated PR creation by all agents.

**Token Location**: `/home/user/BigProjPOC/.github_token`

**Security**:
- The `.github_token` file is excluded from git via `.gitignore`
- Token should NEVER be committed to the repository
- Token persists across sessions for all agents to use

### Creating Pull Requests

All agents can create PRs when their work is complete:

```bash
# Authenticate
export GH_TOKEN=$(cat /home/user/BigProjPOC/.github_token)

# Create PR
gh pr create --base master --head <branch-name> \
  --title "Clear, descriptive title" \
  --body "$(cat <<'EOF'
## Summary
- Bullet points of changes

## Changes
### Section 1
- Details

## Files Changed
- List of files and their purpose

## Test Plan
- Verification steps
EOF
)"
```

**PR Best Practices**:
- Write clear, descriptive titles
- Include comprehensive summary
- List all files changed and their purpose
- Add test plans or verification steps
- Reference related tasks, issues, or specifications
- Follow agent-specific guidelines in `.claude/agents/<agent>-agent.md`

**When to Create PRs**:
- After completing significant work (features, infrastructure, tests)
- When work is ready for review and merge
- After all tests pass and documentation is updated

## Project-Specific Context

[Add any additional context about the project domain, technologies used, specific requirements, or constraints that Claude should be aware of]

---

**Last Updated:** 2026-01-18
**Maintained By:** Project Team
