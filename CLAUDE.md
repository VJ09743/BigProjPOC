# Claude Code Project Guide

## Project Overview

**BigProjPOC** is a proof-of-concept project organized into multiple large modules. This document provides context and guidelines for Claude Code to effectively assist with development.

## Project Structure

```
BigProjPOC/
├── .claude/                 # Claude Code configuration
│   ├── settings.json       # Project settings and preferences
│   └── prompts/            # Custom prompts (if needed)
├── BigModuleA/             # Module A
│   ├── src/                # Source code
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── BigModuleB/             # Module B
│   ├── src/                # Source code
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── BigModuleC/             # Module C
│   ├── src/                # Source code
│   ├── build/              # Build artifacts (excluded from git)
│   └── release/            # Release artifacts (excluded from git)
├── docs/                   # Project documentation
├── release/                # Repository-level release artifacts
└── CLAUDE.md               # This file - project guide for Claude Code

```

## Modules

### BigModuleA
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

### BigModuleB
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

### BigModuleC
Purpose: [To be documented]
- Contains source code in `src/`
- Build outputs go to `build/`
- Release artifacts go to `release/`

## Development Guidelines

### Code Organization
- Keep module code contained within respective `src/` directories
- Build and release directories are excluded from version control
- Maintain separation of concerns between modules

### Build Process
- Build artifacts should be generated in module-specific `build/` directories
- Module-specific releases should be created in module-specific `release/` directories
- Repository-level releases should be placed in the root `release/` directory

### Git Workflow
- Main branch: `master`
- Feature branches: Use `claude/` prefix for Claude-generated work
- Always test changes before committing

## Claude Code Instructions

### CRITICAL: Keeping This File Updated
**ALWAYS update this CLAUDE.md file whenever:**
- Project structure changes (new folders, renamed directories, reorganization)
- New modules or components are added
- Folders are renamed or moved
- Build/release processes change
- New conventions or patterns are established
- Any explanations need to be added or clarified

This file is the source of truth for the project structure and must stay current.

### When Creating New Features
1. Analyze existing code structure before making changes
2. Follow the established patterns in each module
3. Update relevant documentation (especially this CLAUDE.md file if structure changes)
4. Consider impacts across all three modules if making architectural changes

### When Debugging
1. Check all three modules for related issues
2. Review build and release outputs if errors occur
3. Maintain consistency across modules

### Testing Strategy
[To be documented - add specific testing instructions here]

## Common Tasks

### Building the Project
[To be documented - add build commands]

### Running Tests
[To be documented - add test commands]

### Creating Releases
[To be documented - add release process]

## Notes for Claude

- This is a multi-module project - changes may affect multiple modules
- Build and release directories are working directories, not source code
- Maintain consistency in structure and patterns across all modules
- Ask clarifying questions when requirements are ambiguous
- Use plan mode for complex, multi-step changes

## Project-Specific Context

[Add any additional context about the project domain, technologies used, specific requirements, or constraints that Claude should be aware of]

---

**Last Updated:** 2026-01-18
**Maintained By:** Project Team
