# Claude Code Instructions (Local-Only Mode)

**CRITICAL**: Before doing ANY task, you MUST follow the agentic workflow defined in this repository.

## Mandatory First Steps

1. **READ `AI-WORKFLOW.md`** - This is your primary reference for the complete workflow, protocols, and reading order
2. **Follow the reading order defined in AI-WORKFLOW.md** - It tells you which agent file to read at each step

## Agentic Workflow (ALWAYS FOLLOW)

When a user gives you ANY task (feature, bug fix, question, etc.), follow the steps in `AI-WORKFLOW.md`. Summary:

1. **Product Owner** (FIRST) -> Clarify requirements, create user story
2. **Cost Analyst** -> Estimate total task cost, warn if expensive (advisory)
3. **Architect** -> Technical design, choose tech stack
4. **IT Agent** (Setup) -> Install prerequisites + project dependencies, set up scripts/
5. **Developer** -> Implement in modules/
6. **Tester** -> Validate implementation
7. **IT Agent** (Release) -> Build artifacts
8. **Product Owner** (Acceptance) -> Review and present to user

### MANDATORY HANDOVER PROTOCOL (CRITICAL - DO NOT SKIP)

**At EVERY handover between agents, you MUST:**

1. **STOP** - Do not silently continue to the next agent
2. **Save all work** - Ensure all files are saved
3. **Provide handover context** (what was completed, decisions made, open questions)
4. **Ask the user**:
   > "My work as [Agent Name] is complete. Would you like to review my work before I hand over to [Next Agent]?"
5. **Wait for user response** - Do NOT assume the answer
6. **If user wants to review**: Present summary and wait for approval
7. **If user says continue**: Proceed to next agent

**NEVER skip this step. This is the #1 failure mode observed during testing.**

See `AI-WORKFLOW.md` for the full Handover Protocol and Common Agent Protocols.

## Agent Role Files

Read these files to understand each role:
- `ai-assistants/agents/product-owner-agent.md` - Requirements & coordination
- `ai-assistants/agents/architect-agent.md` - Design & architecture
- `ai-assistants/agents/developer-agent.md` - Implementation
- `ai-assistants/agents/tester-agent.md` - Quality assurance
- `ai-assistants/agents/it-agent.md` - Project dependencies & releases
- `ai-assistants/agents/cost-analyst-agent.md` - Cost estimation

## Output Locations

- User stories: `project-management/tasks/backlog/`
- Technical designs: `project-management/designs/`
- Code: `modules/[module-name]/`
- Tests: `modules/[module-name]/test/`
- Build output: `output/`

## REMEMBER

- **Product Owner runs FIRST** - Gather requirements before anything else
- **NEVER code without design** - Architect designs first
- **ALWAYS follow the Handover Protocol** - At every agent transition
- **ALWAYS update domain info** - Keep template customized for the project
- **ALWAYS read `AI-WORKFLOW.md`** - It is the source of truth for all protocols
