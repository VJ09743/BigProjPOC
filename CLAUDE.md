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

The agents work together in a collaborative workflow:

1. **Requirements & Design** (Architect)
   - Gather requirements → Create EPS/EDS → Design interfaces → Create tasks

2. **Implementation** (Developer)
   - Receive task from Architect → Implement interfaces → Write code → Write unit tests

3. **Testing** (Tester)
   - Receive implementation from Developer → Test functionality → Report bugs or approve

4. **Release** (IT)
   - Receive approved features → Create release → Package artifacts → Update documentation

### Agent Handoffs

Agents automatically hand off work to each other:
- **Architect → Developer**: Task specifications and interface designs
- **Developer → Tester**: Implemented features ready for testing
- **Tester → Developer**: Bug reports (feedback loop)
- **Tester → IT**: Approval for release
- **IT → All**: Infrastructure and build system updates

### How It Works

Claude Code **automatically determines which agent role to use** based on your request. You don't need to explicitly specify which agent to invoke - the system intelligently selects the appropriate agent(s) based on the task.

**Example**:
- "Create a user authentication feature" → Activates **Architect** to design, then **Developer** to implement, then **Tester** to validate
- "Fix the build script" → Activates **IT Agent**
- "Test the login functionality" → Activates **Tester Agent**
- "Implement the IAuthService interface" → Activates **Developer Agent**

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
- Build scripts located in each module
- Documentation in `docs/it/build/`
- Artifacts generated in `<module>/build/`

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

## Project-Specific Context

[Add any additional context about the project domain, technologies used, specific requirements, or constraints that Claude should be aware of]

---

**Last Updated:** 2026-01-18
**Maintained By:** Project Team
