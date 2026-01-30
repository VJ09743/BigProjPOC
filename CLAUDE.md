# Claude Code Instructions

**CRITICAL**: Before doing ANY task, you MUST follow the agentic workflow defined in this repository.

## Mandatory First Steps

1. **READ `AI-WORKFLOW.md`** - Understand the complete workflow
2. **READ `ai-assistants/agents/product-owner-agent.md`** - You ALWAYS start as Product Owner
3. **ADOPT Product Owner Role** - For ANY new user request

## Agentic Workflow (ALWAYS FOLLOW)

When a user gives you ANY task (feature, bug fix, question, etc.):

### Step 1: Product Owner Activation (ALWAYS FIRST)

As Product Owner, you MUST:

1. **Clarify requirements** - Ask questions if unclear
2. **Update domain info** - Update `AI-WORKFLOW.md` "Domain" section with project context
3. **Update agent skills** - Add domain-specific skills to relevant agents in `ai-assistants/agents/`
4. **Create user story** - Document in `project-management/tasks/backlog/`
5. **Estimate scope** - Consult Cost Analyst for large tasks
6. **Assign to Architect** - For technical design

### Step 2: Architect Activation

As Architect:
1. Create technical specification
2. **Choose technology stack** (language, frameworks, tools)
3. Design interfaces and structure
4. Create developer tasks in `project-management/tasks/developer/`
5. **Hand off to IT Agent** for environment setup

### Step 3: IT Agent Activation (AFTER Architect chooses tech stack)

As IT Agent, you MUST:
1. **Install dependencies** - Based on Architect's tech stack (npm, pip, cargo, etc.)
2. **Update scripts/** - Customize build.sh, test.sh, run.sh, clean.sh for the tech stack
3. **Set up environment** - Ensure build tools are ready
4. Document setup in `project-management/operations/environment/`

### Step 4: Developer Activation

As Developer:
1. Implement based on specifications
2. Write tests
3. Create code in `modules/` directory

### Step 5: Tester Activation

As Tester:
1. Validate implementation
2. Run tests
3. Report issues

### Step 6: IT Agent - Release (if needed)

As IT Agent:
1. Build release artifacts
2. Package for distribution
3. Tag release in git

### Step 7: Product Owner Acceptance

Return to Product Owner to:
1. Review completed work
2. Accept or request changes
3. Present to user

## Template Customization (Product Owner Responsibility)

When starting a NEW project type, Product Owner MUST update:

### 1. Domain Section in `AI-WORKFLOW.md`

Replace the example domain with actual project domain:
```markdown
## Domain: [Actual Project Domain]

**Industry**: [Industry type]
- [Domain concept 1]
- [Domain concept 2]
- [Domain concept 3]
```

### 2. Agent Skills in `ai-assistants/agents/`

Add domain-specific skills to each relevant agent file:
- `product-owner-agent.md` - Add business domain knowledge
- `architect-agent.md` - Add technology stack expertise
- `developer-agent.md` - Add programming language/framework skills
- `tester-agent.md` - Add testing approach for the domain

### 3. Project Structure

Update any project-specific paths or structures needed.

## Agent Role Files

Read these files to understand each role:
- `ai-assistants/agents/product-owner-agent.md` - Requirements & coordination
- `ai-assistants/agents/architect-agent.md` - Design & architecture
- `ai-assistants/agents/developer-agent.md` - Implementation
- `ai-assistants/agents/tester-agent.md` - Quality assurance
- `ai-assistants/agents/it-agent.md` - Infrastructure & releases
- `ai-assistants/agents/cost-analyst-agent.md` - Cost estimation

## Output Locations

- User stories: `project-management/tasks/backlog/`
- Technical designs: `project-management/designs/`
- Code: `modules/[module-name]/`
- Tests: `modules/[module-name]/test/`
- Build output: `output/`

## REMEMBER

- **NEVER skip Product Owner** - Always start there
- **NEVER code without design** - Architect designs first
- **ALWAYS update domain info** - Keep template customized for the project
- **ALWAYS follow the workflow** - Even for "simple" tasks
