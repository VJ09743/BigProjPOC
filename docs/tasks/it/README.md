# IT Agent Tasks

This folder contains tasks for the **IT Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `setup-build-environment.md`
- Example: `create-release-v1.0.md`
- Example: `setup-ci-pipeline.md`

## Task Template

Use `TEMPLATE.md` in this folder as a starting point.

### Required Fields

**Status**: Current task status
- Allowed values: `TODO` | `Assigned` | `In-Progress` | `Blocked` | `Failed` | `Completed`
- Default: `TODO`

**Priority**: Task priority level
- Allowed values: `critical` | `high` | `medium` | `low`
- `critical`: Urgent, must be done immediately
- `high`: Important, should be done soon
- `medium`: Normal priority (default)
- `low`: Nice to have, can be done later

**Created**: Date task was created (YYYY-MM-DD format)

**Assigned To**: Who is working on this task
- Allowed values: `IT Agent` | `Unassigned`

**Module**: Which module(s) this task affects
- Allowed values: `All` | `[module]` | `[module]` | `[module]` | `N/A`

### Task Structure

```markdown
# Task: [Descriptive Name]

**Status**: TODO
**Priority**: medium
**Created**: 2026-01-18
**Assigned To**: IT Agent
**Module**: All

## Objective
Clear description of what needs to be done

## Requirements
- Requirement 1
- Requirement 2

## Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2
- [ ] Documentation in docs/it/

## Acceptance Criteria
How to verify success

## Notes
Additional context or constraints
```

## Triggering the IT Agent

After creating a task file, tell Claude:
- "Check for new IT tasks"
- "Work on IT tasks"
- "Process tasks in docs/tasks/it/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `TODO`
2. **Assign**: IT Agent picks up task, changes status to `Assigned`
3. **Start**: Agent begins work, changes status to `In-Progress`
4. **Complete**: Agent finishes work, changes status to `Completed`
5. **Archive**: Move completed tasks to `docs/tasks/it/completed/` folder

If issues occur:
- Set status to `Blocked` if waiting on dependencies
- Set status to `Failed` if task cannot be completed as specified

## Example Tasks for IT Agent

- Setting up build environments
- Creating release processes
- Installing tools and infrastructure
- Configuring CI/CD pipelines
- Maintaining build scripts
- Creating versioned releases
