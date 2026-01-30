# Task Management System

This directory contains tasks for all agent types.

## Structure

```
project-management/tasks/
├── backlog/     # User stories (Product Owner Agent)
├── it/          # Tasks for IT Agent
├── architect/   # Tasks for Architect Agent
├── developer/   # Tasks for Developer Agent
└── tester/      # Tasks for Tester Agent
```

**Note**: Product Owner creates user stories in `backlog/` first, then other agents create their tasks.

## How It Works

### 1. Creating Tasks

Each agent folder contains:
- `README.md` - Instructions for that agent type
- `TEMPLATE.md` - Template for creating new tasks

To create a task:
1. Copy `TEMPLATE.md` to a new file with a descriptive name
2. Fill in all sections
3. Set status to `pending`
4. Save the file

### 2. Triggering Agents

**Manual Trigger** (tell Claude):
```
"Check for new tasks in docs/tasks/"
"Work on IT tasks"
"Process pending tasks"
"Check tasks for [agent-name] agent"
```

**Automatic Trigger** (using git hooks):
See `.agent/hooks/post-commit-check-tasks.sh` (if available)

### 3. Task Lifecycle

```
TODO → Assigned → In-Progress → Completed → Archived
                       ↓
                   Blocked/Failed
```

**Status Values and Definitions**:
- `TODO`: Task created, not yet assigned
- `Assigned`: Task assigned to agent, not yet started
- `In-Progress`: Agent is currently working on it
- `Blocked`: Task cannot proceed (waiting for dependencies or resolution)
- `Failed`: Task attempted but failed (requires retry or redesign)
- `Completed`: Task finished successfully
- `Archived`: Task moved to completed/ folder for history

**Priority Values**:
- `critical`: Urgent, must be done immediately (blocks other work)
- `high`: Important, should be done soon
- `medium`: Normal priority
- `low`: Nice to have, can be done later

**Other Field Values**:
See individual agent TEMPLATE.md files for allowed values specific to each agent type.

### 4. Task Organization

**For IT Agent** (`docs/tasks/it/`):
- Build environment setup
- Release management
- Infrastructure tasks
- Tool installation

**For Architect Agent** (`docs/tasks/architect/`):
- Feature design requests
- Requirement gathering
- Architecture decisions
- Interface specifications

**For Developer Agent** (`docs/tasks/developer/`):
- Implementation tasks (direct assignments)
- Bug fixes
- Code refactoring
- Note: Architect also creates tasks in `docs/architecture/tasks/`

**For Tester Agent** (`docs/tasks/tester/`):
- Testing assignments
- Test plan creation
- Validation tasks
- QA work

## Automatic Task Processing

### How to Enable Automatic Task Checking

When you want Claude to automatically check for and process tasks:

**Option 1: Explicit Request**
```
"Check docs/tasks/ for any pending tasks and work on them"
```

**Option 2: Mention Task File**
```
"I've added a task in docs/tasks/it/setup-build.md"
```

Claude will:
1. Detect which agent the task is for (based on folder)
2. Adopt that agent role
3. Read and process the task
4. Update task status
5. Complete the work
6. Update task file to `completed`

### Task Priority

If multiple tasks exist, priority is:
1. `high` priority tasks first
2. `medium` priority tasks
3. `low` priority tasks
4. Within same priority: oldest tasks first

## Archiving Completed Tasks

Create `completed/` subfolders in each agent directory:
```
docs/tasks/it/completed/
docs/tasks/architect/completed/
docs/tasks/developer/completed/
docs/tasks/tester/completed/
```

Move completed task files there for history.

## Example Workflow

### Example 1: IT Task

1. **Create task**:
   ```
   docs/tasks/it/setup-build-environment.md
   ```

2. **Tell Claude**:
   ```
   "Process IT tasks in docs/tasks/it/"
   ```

3. **Claude (as IT Agent)**:
   - Reads task file
   - Updates status to `in-progress`
   - Performs the work
   - Updates status to `completed`
   - Documents results

### Example 2: Feature Development

1. **Create Architect task**:
   ```
   docs/tasks/architect/design-user-auth.md
   ```

2. **Claude (as Architect)**:
   - Creates requirements docs
   - Creates EPS/EDS specs
   - Creates Developer tasks in `docs/architecture/tasks/`
   - Updates status to `completed`

3. **Claude (as Developer)**:
   - Picks up tasks from `docs/architecture/tasks/`
   - Implements features
   - Creates unit tests
   - Marks completed

4. **Claude (as Tester)**:
   - Tests implementation
   - Validates requirements
   - Reports results

5. **Claude (as IT)**:
   - Creates release
   - Packages artifacts

## Best Practices

1. **Clear Task Descriptions**: Be specific about what needs to be done
2. **Set Priorities**: Use high/medium/low appropriately
3. **Reference Docs**: Link to related specifications or requirements
4. **Update Status**: Keep task status current
5. **Archive Completed**: Move done tasks to `completed/` folders
6. **One Task = One File**: Don't combine multiple unrelated tasks

## Task Templates

Each agent folder has a `TEMPLATE.md` with the appropriate structure for that agent type. Always start with the template when creating new tasks.

## Questions?

See individual agent folders' README.md files for agent-specific guidance.
