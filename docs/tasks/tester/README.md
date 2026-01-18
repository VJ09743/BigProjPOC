# Tester Agent Tasks

This folder contains tasks for the **Tester Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `test-authentication-feature.md`
- Example: `validate-api-endpoints.md`
- Example: `create-regression-test-suite.md`

## Task Template

```markdown
# Task: [Task Name]

**Status**: pending | in-progress | completed | blocked
**Priority**: high | medium | low
**Created**: YYYY-MM-DD
**Module**: BigModuleA | BigModuleB | BigModuleC | All

## Objective
Clear description of what needs to be tested/validated

## Requirements to Test
Reference to requirements or specifications being validated

## Deliverables
- [ ] Test plan in docs/tests/plans/
- [ ] Component tests in <module>/tests/component/
- [ ] Integration tests in <module>/tests/integration/
- [ ] System tests in <module>/tests/system/
- [ ] Test report in docs/tests/reports/
- [ ] Bug reports (if issues found)

## Test Scope
- What will be tested
- What won't be tested (out of scope)

## Acceptance Criteria
- All tests pass OR
- Bugs are documented and reported
```

## Triggering the Tester Agent

After creating a task file, tell Claude:
- "Check for new Tester tasks"
- "Work on testing tasks"
- "Test the implementation in docs/tasks/tester/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `pending`
2. **Assign**: Tester Agent picks up task, changes status to `in-progress`
3. **Test**: Create and execute tests
4. **Report**: Document results, create bug reports if needed
5. **Complete**: Changes status to `completed` or `blocked` (if bugs found)
6. **Handoff**:
   - If bugs found → Report to Developer agent
   - If tests pass → Approve for IT agent release
7. **Archive**: Move completed tasks to `docs/tasks/tester/completed/`

## Example Tasks for Tester Agent

- Testing features or implementations
- Creating test plans
- Writing component tests
- Writing integration tests
- Writing system tests
- Validating functionality
- Reporting bugs
- Performing quality assurance
- Creating test documentation
