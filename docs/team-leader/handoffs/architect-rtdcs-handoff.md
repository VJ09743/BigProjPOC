# Architect Agent Handoff: RTDCS Project

**From**: Team Leader Agent
**To**: Architect Agent
**Date**: 2026-01-19
**Project**: Reticle Thermal Distortion Compensation System (RTDCS)
**Status**: Ready for Design Phase

---

## Executive Summary

The RTDCS project has been approved and the development environment is set up. You are now starting **Phase 1: Architect Design** as documented in the project brief.

Your git worktree is ready at: `/home/user/worktree-architect`
Your branch: `claude/architect-rtdcs`

---

## Project Context

### Project Brief
**Full Documentation**: `/home/user/BigProjPOC/docs/team-leader/projects/rtdcs-project-brief.md`

**Quick Summary**:
- **Project**: Reticle Thermal Distortion Compensation System (RTDCS)
- **Purpose**: POC to demonstrate multi-agent workflow, build system, and release process
- **Architecture**: 3-module system communicating via shared memory and Thrift RPC
- **Modules**:
  - BigModuleA: Thermal Monitor Service
  - BigModuleB: Distortion Predictor Service (uses **FICTIONAL** Zeeman model)
  - BigModuleC: Compensation Controller Service

**CRITICAL**: The "Zeeman Thermal Expansion Model" is **FICTIONAL** and must be marked as such in all documentation and code.

---

## Your Worktree Setup

### Location
```bash
cd /home/user/worktree-architect
```

### Branch
- **Your branch**: `claude/architect-rtdcs-{sessionID}` (e.g., `claude/architect-rtdcs-pbCFa`)
- **Based on**: `project-feature-int/rtdcs` (which is based on `recommended-development` → `master`)
- **Push target**: `origin/claude/architect-rtdcs-{sessionID}`

**CRITICAL: Branch Naming Convention**
- Branch MUST start with `claude/` prefix
- Branch MUST end with the session ID (e.g., `-pbCFa`)
- Format: `claude/architect-rtdcs-{sessionID}`
- This naming convention is REQUIRED for remote pushes to GitHub

### Git Operations
```bash
# You're already in the right branch in your worktree
cd /home/user/worktree-architect

# Check status
git status

# Stage and commit your work
git add <files>
git commit -m "message"

# Push to remote (branch naming with sessionID required for push to succeed)
git push -u origin claude/architect-rtdcs-{sessionID}

# Pull latest (if needed)
git pull origin claude/architect-rtdcs-{sessionID}
```

---

## Your Responsibilities (Phase 1)

As documented in the project brief, you need to:

### 1. Create External Product Specification (EPS)
**Location**: `docs/architecture/eps/rtdcs-eps.md`

**Contents**:
- Product overview and purpose
- System requirements (functional and non-functional)
- User stories / use cases
- System context and boundaries
- Key quality attributes
- Constraints and assumptions
- **Mark FICTIONAL elements clearly**

### 2. Create External Design Specification (EDS)
**Location**: `docs/architecture/eds/rtdcs-eds.md`

**Contents**:
- System architecture overview
- Component descriptions (BigModuleA, B, C)
- Communication patterns (shared memory + Thrift)
- Data flow diagrams
- Interface specifications (high-level)
- Deployment architecture
- **Mark FICTIONAL Zeeman model clearly**

### 3. Design Thrift Interfaces
**Locations**:
- `BigModuleA/src/ext/interfaces/IThermalMonitor.thrift`
- `BigModuleB/src/ext/interfaces/IDistortionPredictor.thrift`
- `BigModuleC/src/ext/interfaces/ICompensationController.thrift`

**Guidelines**:
- Follow Thrift IDL syntax
- Define services and data structures
- Document parameters and return types
- **Mark FICTIONAL elements in comments**
- Reference the project brief for initial interface designs

### 4. Define Shared Memory Structure
**Location**: `docs/architecture/interfaces/shared-memory-spec.md`

**Contents**:
- `SharedLithoState` structure definition
- Field descriptions and units
- Access patterns (read/write by which modules)
- Synchronization strategy (if needed)
- Memory layout and size
- **Mark FICTIONAL data fields clearly**

### 5. Create Development Tasks for Developer
**Location**: `docs/architecture/tasks/rtdcs-developer-tasks.md`

**Contents**:
- Task breakdown for implementing each module
- Implementation order and dependencies
- Specific requirements per module
- Unit test requirements
- Acceptance criteria per task

### 6. Document Architecture Decisions
**Location**: `docs/architecture/decisions/rtdcs-architecture-decisions.md`

**Contents**:
- Why Thrift for RPC?
- Why shared memory for thermal state?
- Design patterns selected (Observer, Strategy, etc.)
- Trade-offs and alternatives considered
- **Why FICTIONAL model for POC purposes**

---

## Design Guidelines

### Apply Your Architecture Expertise

As the Architect Agent, apply your expertise in:
- **Object-Oriented Architecture**: Design with OO principles, SOLID, clean interfaces
- **Design Patterns**: Select appropriate patterns (Observer for temperature monitoring, Strategy for prediction algorithms, Command for compensation actions)
- **Lithography Domain**: Apply your lithography knowledge to make the system realistic (even with FICTIONAL model)
- **Interface Design**: Create clean, minimal, well-segregated interfaces
- **Quality Attributes**: Consider performance, testability, maintainability

### Key Design Decisions to Make

1. **Communication Pattern**:
   - When to use shared memory vs Thrift RPC?
   - Recommendation: Shared memory for high-frequency data, Thrift for commands

2. **Design Patterns**:
   - **Observer**: ThermalMonitor publishes temperature events
   - **Strategy**: DistortionPredictor uses strategy pattern for FICTIONAL Zeeman model
   - **Command**: CompensationController receives compensation commands

3. **Error Handling**:
   - How should modules handle communication failures?
   - What happens if shared memory is corrupted?
   - How to recover from prediction errors?

4. **Thrift Interface Versioning**:
   - How to version interfaces for future changes?
   - Backward compatibility strategy

5. **Shared Memory Synchronization**:
   - Do we need mutexes/semaphores?
   - Who owns what fields?
   - Read/write access patterns

### FICTIONAL Elements to Document

Throughout your specifications, clearly mark these as **FICTIONAL**:

1. **Zeeman Thermal Expansion Model**:
   ```
   // FICTIONAL - FOR POC DEMONSTRATION ONLY
   // The Zeeman Thermal Expansion Model is a fictional algorithm
   // created for this POC. It does NOT represent real lithography
   // thermal expansion physics.
   ```

2. **Thermal Expansion Coefficients**:
   ```
   // FICTIONAL COEFFICIENTS - NOT BASED ON REAL PHYSICS
   double zeeman_coefficient_order_2 = 1.5e-6;  // nm/°C²
   double zeeman_coefficient_order_3 = 2.3e-9;  // nm/°C³
   ```

3. **Temperature Ranges and Sensor Values**:
   ```
   // FICTIONAL SIMULATION DATA
   // Real lithography reticle temperatures and ranges may differ
   ```

---

## Reference Materials

### Project Brief
- `/home/user/BigProjPOC/docs/team-leader/projects/rtdcs-project-brief.md`
- Contains complete project context, architecture overview, and requirements

### Build System Documentation
- `/home/user/BigProjPOC/docs/it/build/module-build-system.md`
- Understand how Thrift interfaces will be generated and built

### Existing Module Structure
- `BigModuleA/`, `BigModuleB/`, `BigModuleC/` directories
- Review `Makefile` in each module to understand build process

### CLAUDE.md
- `/home/user/BigProjPOC/CLAUDE.md`
- Main project documentation and agent system overview

---

## Peer Review Process

### After You Complete Your Work

1. **Commit your work** to `claude/architect-rtdcs` branch
2. **Create review request** document:
   - Location: `docs/team-leader/reviews/architect-rtdcs-review.md`
   - Use template from project brief
3. **Request reviews from**:
   - **Developer Agent**: Will review implementability, interface design, testability
   - **IT Agent**: Will review build system compatibility, Thrift structure

### Review Checklist

Reviewers will check:
- [ ] Interface design follows SOLID principles
- [ ] Thrift interfaces are well-defined and buildable
- [ ] Shared memory structure is appropriate
- [ ] **FICTIONAL** elements clearly documented throughout
- [ ] Design patterns appropriately selected
- [ ] Specifications are complete and clear
- [ ] Development tasks are well-defined for Developer

### After 2+ Approvals

1. **Create PR** from `claude/architect-rtdcs` → `project-feature-int/rtdcs`
2. **Include in PR description**:
   - Summary of design decisions
   - Peer review summary
   - List of documents created
   - Any open questions or considerations
3. **User will review** and merge PR
4. **Developer Agent begins** Phase 2 after your PR is merged

---

## Success Criteria

Your Phase 1 is complete when:
- [ ] EPS document is comprehensive and clear
- [ ] EDS document defines system architecture completely
- [ ] All 3 Thrift interfaces are designed and documented
- [ ] Shared memory structure is fully specified
- [ ] Development tasks are created for Developer Agent
- [ ] Architecture decisions are documented with rationale
- [ ] **FICTIONAL** elements are clearly marked everywhere
- [ ] Peer review completed (2+ approvals)
- [ ] PR created and ready for user review

---

## Communication

### Questions or Clarifications Needed?
- Document questions in your review request
- Team Leader will facilitate discussions with other agents
- User will provide final decisions on ambiguities

### Collaborating with Other Agents
- You may need to discuss interface design with Developer (via Team Leader)
- You may need to discuss build system with IT (via Team Leader)
- Document all discussions and decisions

---

## Next Steps

1. **Navigate to your worktree**:
   ```bash
   cd /home/user/worktree-architect
   ```

2. **Read the project brief thoroughly**:
   ```bash
   cat /home/user/BigProjPOC/docs/team-leader/projects/rtdcs-project-brief.md
   ```

3. **Create directory structure for your deliverables**:
   ```bash
   mkdir -p docs/architecture/eps
   mkdir -p docs/architecture/eds
   mkdir -p docs/architecture/interfaces
   mkdir -p docs/architecture/tasks
   mkdir -p docs/architecture/decisions
   mkdir -p BigModuleA/src/ext/interfaces
   mkdir -p BigModuleB/src/ext/interfaces
   mkdir -p BigModuleC/src/ext/interfaces
   ```

4. **Start with EPS document** as your first deliverable

5. **Follow the Task Analysis & Collaboration Protocol**:
   - Ask clarifying questions first
   - Document your understanding
   - Think like an architect (identify issues, suggest improvements)
   - Collaborate with other agents if needed
   - Reach consensus before proceeding

---

## Architect Agent - You Are Now Active

**You are now the Architect Agent working on RTDCS Phase 1.**

Apply your decades of experience, OOD expertise, and lithography domain knowledge to create a solid architectural foundation for this POC project.

**Start by reading the project brief, asking any clarifying questions, and then begin creating the EPS document.**

Good luck! 🎯

---

**Team Leader Agent**
Handoff Date: 2026-01-19
