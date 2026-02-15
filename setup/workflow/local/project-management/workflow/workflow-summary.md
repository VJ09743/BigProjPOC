# Multi-Agent Workflow Summary (Local Mode)

## Overview

This is the **local-only** workflow. All work happens directly in your project directory. There are no branches, no pull requests, and no remote repositories involved.

---

## Complete Workflow from Task to Completion

### Step 1: Give Task to Product Owner

**You (User)**: Describe what you want in conversation.

Example: "Implement a temperature monitoring feature"

### Step 2: Product Owner Analyzes and Assigns

**Product Owner Agent** (AI acting as Product Owner):
- Analyzes the task
- Reviews agent capabilities
- Determines the best agent for the job
- Creates task specification in `project-management/tasks/`
- Assigns work to the appropriate agent

Example assignments:
- "Design temperature monitoring" --> **Architect Agent**
- "Implement temperature sensor class" --> **Developer Agent**
- "Test temperature thresholds" --> **Tester Agent**
- "Set up build for new module" --> **IT Agent**

### Step 3: Agent Works on Task

**Assigned Agent** (AI acting as that agent):
- Works directly in the project directory
- Implements the solution
- Follows agent-specific best practices
- Documents their work

### Step 4: Agent Saves Work and Announces Completion

**Agent**:
- Saves all files
- Announces what was completed
- Presents a summary of changes made
- Asks the user to review

### Step 5: User Reviews

**You (User)**:
- Review the work in your project directory
- Check the changed files
- Verify the implementation meets your needs
- Provide feedback or approve

### Step 6: Continue or Request Changes

- **If satisfied**: Tell the AI to continue to the next agent or next task
- **If changes needed**: Describe what needs to change. The agent will revise and present again.

---

## Agent Assignment Rules

The Product Owner assigns tasks based on agent expertise:

| Task Type | Assigned To |
|-----------|-------------|
| Design new features or systems | **Architect Agent** |
| Implement features, write code | **Developer Agent** |
| Test and validate implementations | **Tester Agent** |
| Set up builds, dependencies, scripts | **IT Agent** |
| Estimate costs for large operations | **Cost Analyst** |

---

## Handover Between Agents

When one agent finishes and passes work to the next:

1. **Current agent** saves all work and announces completion
2. **Current agent** asks user: "My work is complete. Would you like me to continue to [Next Agent]?"
3. **User** reviews and responds
4. **Next agent** picks up, reads the context, and asks clarifying questions before starting

---

## Workflow Diagram

```
User gives task
       |
Product Owner analyzes and assigns
       |
Agent works directly in project directory
       |
Agent saves work and presents summary
       |
User reviews
       |
  Approved?
  /       \
Yes        No
 |          |
Continue   Agent revises
to next     and presents
agent/task  again
```

---

## Key Points

- **No branches or PRs** -- all work happens directly in your project directory
- **Product Owner always starts first** -- every new request goes through Product Owner
- **User reviews at each handover** -- you control when to proceed
- **Agent handover is explicit** -- agents announce completion and wait for your go-ahead
- **All documentation is saved locally** -- in `project-management/` directories

---

## Important Directories

- **Task Specifications**: `project-management/tasks/`
- **User Stories**: `project-management/tasks/backlog/`
- **Architecture Designs**: `project-management/designs/`
- **Test Plans & Reports**: `project-management/quality/`
- **Agent Role Definitions**: `ai-assistants/agents/`
- **Source Code**: `modules/[module-name]/src/`
- **Tests**: `modules/[module-name]/test/`
- **Build Output**: `output/`

---

## Next Steps

Ready to start! Here is what to do:
1. Give the AI a task
2. The AI acts as Product Owner and assigns to the appropriate agent
3. The agent works and presents results
4. You review and approve
5. Continue until the task is done!
