# IT Agent Tasks

This folder contains tasks for the **IT Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `setup-build-environment.md`
- Example: `create-release-v1.0.md`
- Example: `setup-ci-pipeline.md`

## Task Template

```markdown
# Task: [Task Name]

**Status**: pending | in-progress | completed | blocked
**Priority**: high | medium | low
**Created**: YYYY-MM-DD

## Objective
Clear description of what needs to be done

## Requirements
- Requirement 1
- Requirement 2

## Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2

## Notes
Any additional context or constraints
```

## Triggering the IT Agent

After creating a task file, tell Claude:
- "Check for new IT tasks"
- "Work on IT tasks"
- "Process tasks in docs/tasks/it/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `pending`
2. **Assign**: IT Agent picks up task, changes status to `in-progress`
3. **Complete**: IT Agent finishes work, changes status to `completed`
4. **Archive**: Move completed tasks to `docs/tasks/it/completed/` folder

## Example Tasks for IT Agent

- Setting up build environments
- Creating release processes
- Installing tools and infrastructure
- Configuring CI/CD pipelines
- Maintaining build scripts
- Creating versioned releases
