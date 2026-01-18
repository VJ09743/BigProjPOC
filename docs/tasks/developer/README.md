# Developer Agent Tasks

This folder contains tasks for the **Developer Agent** to work on.

**Note**: The Architect Agent also creates tasks for Developer in `docs/architecture/tasks/`. This folder is for direct task assignments that don't require architecture/design work first.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `implement-user-validator.md`
- Example: `fix-login-bug.md`
- Example: `refactor-data-layer.md`

## Task Template

```markdown
# Task: [Task Name]

**Status**: pending | in-progress | completed | blocked
**Priority**: high | medium | low
**Created**: YYYY-MM-DD
**Module**: BigModuleA | BigModuleB | BigModuleC

## Objective
Clear description of what needs to be implemented

## Interface Requirements
Which interfaces in <module>/src/ext/interfaces/ need to be created/modified

## Implementation Details
- Technical approach
- Key algorithms or patterns
- Dependencies

## Deliverables
- [ ] Implementation in <module>/src/
- [ ] Unit tests in <module>/tests/unit/
- [ ] Code documentation
- [ ] Interface implementation (if applicable)

## Acceptance Criteria
- [ ] Code passes all unit tests
- [ ] Code follows project standards
- [ ] Ready for Tester agent validation
```

## Triggering the Developer Agent

After creating a task file, tell Claude:
- "Check for new Developer tasks"
- "Implement tasks in docs/tasks/developer/"
- "Work on development tasks"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `pending`
2. **Assign**: Developer Agent picks up task, changes status to `in-progress`
3. **Implement**: Developer writes code and tests
4. **Complete**: Changes status to `completed`
5. **Handoff**: Notify Tester agent for validation
6. **Archive**: Move completed tasks to `docs/tasks/developer/completed/`

## Example Tasks for Developer Agent

- Implementing features or functionality
- Creating or modifying interfaces
- Writing code
- Fixing bugs
- Writing unit tests
- Code refactoring
- Performance optimization
