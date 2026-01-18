# Architect Agent Tasks

This folder contains tasks for the **Architect Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `design-authentication-system.md`
- Example: `create-api-specifications.md`
- Example: `document-module-interfaces.md`

## Task Template

```markdown
# Task: [Task Name]

**Status**: pending | in-progress | completed | blocked
**Priority**: high | medium | low
**Created**: YYYY-MM-DD

## Objective
Clear description of what needs to be designed/documented

## Requirements
- Requirement 1
- Requirement 2

## Deliverables
- [ ] Requirements document
- [ ] EPS (External Product Specification)
- [ ] EDS (External Design Specification)
- [ ] Interface specifications
- [ ] Development tasks for Developer agent

## Notes
Any additional context or constraints
```

## Triggering the Architect Agent

After creating a task file, tell Claude:
- "Check for new Architect tasks"
- "Work on Architect tasks"
- "Design the feature in docs/tasks/architect/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `pending`
2. **Assign**: Architect Agent picks up task, changes status to `in-progress`
3. **Complete**: Architect Agent finishes design, creates specs and tasks
4. **Handoff**: Architect creates tasks for Developer in `docs/architecture/tasks/`
5. **Archive**: Move completed tasks to `docs/tasks/architect/completed/`

## Example Tasks for Architect Agent

- Designing new features or systems
- Creating requirements documents
- Writing EPS and EDS specifications
- Designing interfaces and APIs
- Creating development tasks for Developer agent
- Making architectural decisions
- Documenting system architecture
