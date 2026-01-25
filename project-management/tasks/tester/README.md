# Tester Agent Tasks

This folder contains tasks for the **Tester Agent** to work on.

## Creating a New Task

Create a new markdown file with a descriptive name:
- Example: `test-authentication-feature.md`
- Example: `validate-api-endpoints.md`
- Example: `create-regression-test-suite.md`

## Task Template

Use `TEMPLATE.md` in this folder as a starting point.

### Required Fields

**Status**: Current task status
- Allowed values: `TODO` | `Assigned` | `In-Progress` | `Blocked` | `Failed` | `Completed`
- Default: `TODO`

**Priority**: Task priority level
- Allowed values: `critical` | `high` | `medium` | `low`
- `critical`: Urgent, must be done immediately (e.g., release blockers)
- `high`: Important, should be done soon
- `medium`: Normal priority (default)
- `low`: Nice to have, can be done later

**Created**: Date task was created (YYYY-MM-DD format)

**Assigned To**: Who is working on this task
- Allowed values: `Tester Agent` | `Unassigned`

**Module**: Which module(s) this task tests
- Allowed values: `[module]` | `[module]` | `[module]` | `All` | `Multiple`

**Test Type**: Type of testing to perform
- Allowed values: `Component` | `Integration` | `System` | `Regression` | `Performance` | `Security`

### Task Structure

```markdown
# Task: [Descriptive Name]

**Status**: TODO
**Priority**: medium
**Created**: 2026-01-18
**Assigned To**: Tester Agent
**Module**: [module]
**Test Type**: Component

## Objective
Clear description of what needs to be tested/validated

## Requirements to Test
Reference to EPS/EDS or specifications

## Deliverables
- [ ] Test plan in docs/tests/plans/
- [ ] Component tests in <module>/tests/component/
- [ ] Test report in docs/tests/reports/
- [ ] Bug reports (if issues found)

## Test Scope
- What will be tested
- What won't be tested

## Acceptance Criteria
- All tests pass OR
- Bugs documented and reported
```

## Triggering the Tester Agent

After creating a task file, tell Claude:
- "Check for new Tester tasks"
- "Work on testing tasks"
- "Test the implementation in docs/tasks/tester/"

## Task Lifecycle

1. **Create**: Add new `.md` file with status `TODO`
2. **Assign**: Tester Agent picks up task, changes status to `Assigned`
3. **Start**: Agent begins work, changes status to `In-Progress`
4. **Plan**: Create test plan and test cases
5. **Execute**: Run tests (component, integration, system as needed)
6. **Report**: Document results in test report
7. **Complete or Block**:
   - If all tests pass → Status `Completed`, approve for release
   - If bugs found → Status `Blocked`, create bug reports
8. **Handoff**:
   - If bugs found → Report to Developer agent for fixes
   - If tests pass → Approve for IT agent release
9. **Archive**: Move completed tasks to `docs/tasks/tester/completed/`

If issues occur:
- Set status to `Blocked` if waiting on bug fixes from Developer
- Set status to `Failed` if testing cannot be completed as specified (e.g., missing test environment)

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
