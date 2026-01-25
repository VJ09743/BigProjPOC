# Documentation

This directory contains all project documentation organized by function.

## Structure

```
docs/
├── tasks/              # Task management system
│   ├── it/             # Tasks for IT Agent
│   ├── architect/      # Tasks for Architect Agent
│   ├── developer/      # Tasks for Developer Agent
│   └── tester/         # Tasks for Tester Agent
├── architecture/       # Architecture documentation
│   ├── eps/            # External Product Specifications
│   ├── eds/            # External Design Specifications
│   ├── interfaces/     # Interface specifications
│   ├── tasks/          # Development tasks from Architect
│   └── decisions/      # Architecture Decision Records
├── requirements/       # Requirements documentation
│   ├── functional/     # Functional requirements
│   └── non-functional/ # Non-functional requirements
├── tests/              # Test documentation
│   ├── plans/          # Test plans
│   ├── reports/        # Test reports
│   ├── bugs/           # Bug reports
│   └── documentation/  # Test documentation
├── it/                 # IT documentation
│   ├── build/          # Build system docs
│   ├── releases/       # Release management docs
│   ├── environment/    # Environment setup
│   └── infrastructure/ # Infrastructure docs
└── team-leader/        # Team Leader documentation
    ├── plans/          # Planning documents
    ├── lessons-learned/# Lessons learned
    └── scripts/        # Helper scripts
```

## How to Use

### For Task Management
See `tasks/README.md` for the task management system.

### For Architecture
- Create EPS docs for user-facing features in `architecture/eps/`
- Create EDS docs for technical design in `architecture/eds/`
- Document decisions in `architecture/decisions/`

### For Testing
- Create test plans in `tests/plans/`
- Record test results in `tests/reports/`
- Report bugs in `tests/bugs/`

### For Infrastructure
- Document build systems in `it/build/`
- Track releases in `it/releases/`
- Setup guides in `it/environment/`
