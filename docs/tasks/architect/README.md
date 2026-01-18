# Architect Agent Tasks

This folder contains tasks for the **Architect Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `design-authentication-system.md`
- Example: `create-api-specifications.md`
- Example: `document-module-interfaces.md`

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
- Allowed values: `Architect Agent` | `Unassigned`

**Type**: Type of architecture work
- Allowed values: `Design` | `Requirements` | `Specification` | `Architecture` | `Planning`

### Task Structure

```markdown
# Task: [Descriptive Name]

**Status**: TODO
**Priority**: medium
**Created**: 2026-01-18
**Assigned To**: Architect Agent
**Type**: Design

## Objective
Clear description of what needs to be designed/documented

## User Requirements
- User need 1
- User need 2

## Deliverables
- [ ] Requirements document in docs/requirements/
- [ ] EPS in docs/architecture/eps/
- [ ] EDS in docs/architecture/eds/
- [ ] Interface specifications
- [ ] Development tasks for Developer agent

## Notes
Additional context or constraints
```

## Triggering the Architect Agent

After creating a task file, tell Claude:
- "Check for new Architect tasks"
- "Work on Architect tasks"
- "Design the feature in docs/tasks/architect/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `TODO`
2. **Assign**: Architect Agent picks up task, changes status to `Assigned`
3. **Start**: Agent begins work, changes status to `In-Progress`
4. **Design**: Create EPS, EDS, interface specs, and development tasks
5. **Complete**: Agent finishes design, changes status to `Completed`
6. **Handoff**: Architect creates tasks for Developer in `docs/architecture/tasks/`
7. **Archive**: Move completed tasks to `docs/tasks/architect/completed/`

If issues occur:
- Set status to `Blocked` if waiting on requirements clarification
- Set status to `Failed` if design cannot be completed as specified

## Example Tasks for Architect Agent

- Designing new features or systems
- Creating requirements documents
- Writing EPS and EDS specifications
- Designing interfaces and APIs
- Creating development tasks for Developer agent
- Making architectural decisions
- Documenting system architecture
