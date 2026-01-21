# RTDCS Project - Git Worktree Setup

**Team Leader**: Setup Complete
**Date**: 2026-01-19
**Project**: Reticle Thermal Distortion Compensation System (RTDCS)

---

## Overview

Git worktrees have been set up for parallel agent development. Each agent has an independent working directory with their own branch.

---

## Branch Structure

**CRITICAL: Branch Naming Convention**
- All agent work branches MUST start with `claude/` prefix
- All agent work branches MUST end with the session ID (e.g., `-pbCFa`)
- Format: `claude/{agent}-{project}-{sessionID}`
- Example: `claude/architect-rtdcs-pbCFa`
- This naming convention is REQUIRED for remote pushes to GitHub

```
master (remote and local)
  │
  └─ recommended-development (local only)
       │
       └─ project-feature-int/rtdcs (local only, integration branch)
            │
            ├─ claude/architect-rtdcs-{sessionID} (Architect's work)
            │
            ├─ claude/developer-rtdcs-{sessionID} (Developer's work)
            │
            ├─ claude/tester-rtdcs-{sessionID} (Tester's work)
            │
            └─ claude/it-rtdcs-{sessionID} (IT's work)
```

**Note**: The `recommended-development` and `project-feature-int/rtdcs` branches are local-only because they don't follow the `claude/*-{sessionID}` naming convention required for remote pushes. Agent work branches use `claude/*-{sessionID}` pattern to enable remote pushes.

---

## Worktree Locations

| Agent | Worktree Path | Branch | Status |
|-------|---------------|---------|--------|
| **Architect** | `/home/user/worktree-architect` | `claude/architect-rtdcs-{sessionID}` | ✅ Ready |
| **Developer** | `/home/user/worktree-developer` | `claude/developer-rtdcs-{sessionID}` | ⏳ Pending Architect |
| **Tester** | `/home/user/worktree-tester` | `claude/tester-rtdcs-{sessionID}` | ⏳ Pending Developer |
| **IT** | `/home/user/worktree-it` | `claude/it-rtdcs-{sessionID}` | ⏳ Pending Tester |

---

## Worktree Commands

### List All Worktrees
```bash
cd /home/user/BigProjPOC
git worktree list
```

**Output**:
```
/home/user/BigProjPOC          703c0bb [project-feature-int/rtdcs]
/home/user/worktree-architect  703c0bb [claude/architect-rtdcs]
/home/user/worktree-developer  703c0bb [claude/developer-rtdcs]
/home/user/worktree-it         703c0bb [claude/it-rtdcs]
/home/user/worktree-tester     703c0bb [claude/tester-rtdcs]
```

### Navigate to Agent Worktree
```bash
# Architect
cd /home/user/worktree-architect

# Developer
cd /home/user/worktree-developer

# Tester
cd /home/user/worktree-tester

# IT
cd /home/user/worktree-it
```

### Check Branch in Worktree
```bash
cd /home/user/worktree-architect
git branch --show-current
# Output: claude/architect-rtdcs
```

### Remove Worktree (When Done)
```bash
cd /home/user/BigProjPOC
git worktree remove ../worktree-architect
```

---

## Agent Workflow

### Phase 1: Architect (Current)

1. **Architect navigates** to `/home/user/worktree-architect`
2. **Architect works** on design documents, Thrift interfaces
3. **Architect commits** to `claude/architect-rtdcs-{sessionID}` branch
4. **Architect pushes** to `origin/claude/architect-rtdcs-{sessionID}` (allowed because of claude/ prefix + sessionID)
5. **Architect requests peer review** from Developer and IT agents
6. **After 2+ approvals**: Architect creates PR to `project-feature-int/rtdcs`
7. **User reviews and merges** PR

### Phase 2: Developer

8. **Developer navigates** to `/home/user/worktree-developer`
9. **Developer rebases** on latest `project-feature-int/rtdcs` (includes Architect's work)
10. **Developer implements** modules and unit tests
11. **Developer commits** to `claude/developer-rtdcs-{sessionID}` branch
12. **Developer pushes** to `origin/claude/developer-rtdcs-{sessionID}`
13. **Developer requests peer review** from Architect and Tester agents
14. **After 2+ approvals**: Developer creates PR
15. **User reviews and merges** PR

### Phase 3: Tester

16. **Tester navigates** to `/home/user/worktree-tester`
17. **Tester rebases** on latest `project-feature-int/rtdcs` (includes Developer's code)
18. **Tester creates** test plans and automated tests
19. **Tester commits** to `claude/tester-rtdcs-{sessionID}` branch
20. **Tester pushes** to `origin/claude/tester-rtdcs-{sessionID}`
21. **Tester requests peer review** from Developer and Architect agents
22. **After 2+ approvals**: Tester creates PR
23. **User reviews and merges** PR

### Phase 4: IT

24. **IT Agent navigates** to `/home/user/worktree-it`
25. **IT Agent rebases** on latest `project-feature-int/rtdcs` (includes all work)
26. **IT Agent validates** builds, runs tests, creates release
27. **IT Agent commits** to `claude/it-rtdcs-{sessionID}` branch
28. **IT Agent pushes** to `origin/claude/it-rtdcs-{sessionID}`
29. **IT Agent requests peer review** from Tester and Developer agents
30. **After 2+ approvals**: IT Agent creates PR
31. **User reviews and merges** PR

### Phase 5: Final Integration (IT Agent)

32. **IT Agent merges** `project-feature-int/rtdcs` → `recommended-development` → `master`
33. **IT Agent tags** release: `v0.1.0-rtdcs`
34. **IT Agent cleans up** worktrees
35. **IT Agent documents** lessons learned

---

## Peer Review Process

Each agent must get **2+ approvals** from peer agents before creating PR for user review:

| Agent Working | Reviewer 1 | Reviewer 2 |
|---------------|------------|------------|
| **Architect** | Developer | IT |
| **Developer** | Architect | Tester |
| **Tester** | Developer | Architect |
| **IT** | Tester | Developer |

**Review documents** are created in:
- `docs/team-leader/reviews/architect-rtdcs-review.md`
- `docs/team-leader/reviews/developer-rtdcs-review.md`
- `docs/team-leader/reviews/tester-rtdcs-review.md`
- `docs/team-leader/reviews/it-rtdcs-review.md`

---

## Important Notes

### Branch Naming Convention
- **Agent work branches** use `claude/*` prefix to enable remote pushes
- **Integration branches** (`recommended-development`, `project-feature-int/rtdcs`) are local-only
- User can create remote versions of integration branches if desired

### Rebasing
- Each agent should **rebase** their branch on latest `project-feature-int/rtdcs` before starting work
- This ensures they have the latest approved changes from previous phases

### Conflict Resolution
- Worktrees eliminate conflicts during concurrent work
- Each agent works independently in their own directory
- Integration happens via PRs to `project-feature-int/rtdcs`

### Worktree Cleanup
- Worktrees should be **removed after final integration**
- Command: `git worktree remove ../worktree-{agent}`
- This keeps the repository clean

---

## Handoff Documents

Each agent receives a comprehensive handoff document:

- **Architect**: `/home/user/BigProjPOC/docs/team-leader/handoffs/architect-rtdcs-handoff.md`
- **Developer**: (Will be created after Architect completes)
- **Tester**: (Will be created after Developer completes)
- **IT**: (Will be created after Tester completes)

---

## Current Status

✅ **Setup Complete**
✅ **All worktrees created**
✅ **Architect handoff document ready**
⏳ **Architect Agent starting Phase 1**

---

## Team Leader Monitoring

Team Leader will:
- Monitor progress in each worktree
- Facilitate peer reviews
- Coordinate handoffs between phases
- Resolve blockers
- Ensure quality and architectural alignment

---

**Ready to begin RTDCS development! 🎯**

**Architect Agent: Start your work in `/home/user/worktree-architect`**
