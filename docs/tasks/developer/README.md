# Developer Agent Tasks

This folder contains tasks for the **Developer Agent** to work on.

**Note**: The Architect Agent also creates tasks for Developer in `docs/architecture/tasks/`. This folder is for direct task assignments that don't require architecture/design work first.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `implement-user-validator.md`
- Example: `fix-login-bug.md`
- Example: `refactor-data-layer.md`

## Task Template

Use `TEMPLATE.md` in this folder as a starting point.

### Required Fields

**Status**: Current task status
- Allowed values: `TODO` | `Assigned` | `In-Progress` | `Blocked` | `Failed` | `Completed`
- Default: `TODO`

**Priority**: Task priority level
- Allowed values: `critical` | `high` | `medium` | `low`
- `critical`: Urgent, must be done immediately (e.g., critical bugs)
- `high`: Important, should be done soon
- `medium`: Normal priority (default)
- `low`: Nice to have, can be done later

**Created**: Date task was created (YYYY-MM-DD format)

**Assigned To**: Who is working on this task
- Allowed values: `Developer Agent` | `Unassigned`

**Module**: Which module this task affects
- Allowed values: `BigModuleA` | `BigModuleB` | `BigModuleC` | `Multiple`

**Type**: Type of development work
- Allowed values: `Implementation` | `Bug Fix` | `Refactoring` | `Enhancement` | `Interface`

### Task Structure

```markdown
# Task: [Descriptive Name]

**Status**: TODO
**Priority**: medium
**Created**: 2026-01-18
**Assigned To**: Developer Agent
**Module**: BigModuleA
**Type**: Implementation

## Objective
Clear description of what needs to be implemented

## Interface Requirements
Interfaces in <module>/src/ext/interfaces/ to create/modify

## Implementation Details
- Technical approach
- Key algorithms or patterns

## Deliverables
- [ ] Implementation in <module>/src/
- [ ] Unit tests in <module>/tests/unit/
- [ ] Code documentation

## Acceptance Criteria
- [ ] All unit tests pass
- [ ] Code follows standards
- [ ] Ready for Tester validation
```

## Triggering the Developer Agent

After creating a task file, tell Claude:
- "Check for new Developer tasks"
- "Implement tasks in docs/tasks/developer/"
- "Work on development tasks"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `TODO`
2. **Assign**: Developer Agent picks up task, changes status to `Assigned`
3. **Start**: Agent begins work, changes status to `In-Progress`
4. **Implement**: Write code, implement interfaces, create unit tests
5. **Test**: Run unit tests, verify all pass
6. **Complete**: Changes status to `Completed`
7. **Handoff**: Notify Tester agent for validation
8. **Archive**: Move completed tasks to `docs/tasks/developer/completed/`

If issues occur:
- Set status to `Blocked` if waiting on design specs or dependencies
- Set status to `Failed` if implementation encounters insurmountable issues

## Example Tasks for Developer Agent

- Implementing features or functionality
- Creating or modifying interfaces
- Writing code
- Fixing bugs
- Writing unit tests
- Code refactoring
- Performance optimization
