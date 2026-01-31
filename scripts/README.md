# Scripts

This folder contains **template scripts** for building, testing, and running your project.

## IMPORTANT: IT Agent Must Customize These

These scripts are **templates only**. When Architect chooses a technology stack, IT Agent must:

1. Read each script's instructions
2. Add the appropriate commands for the project's tech stack
3. Remove the TODO placeholders

**Scripts will fail with an error until customized.**

## Available Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `build.sh` | Build all modules | Template - needs customization |
| `test.sh` | Run all tests | Template - needs customization |
| `run.sh` | Run the application | Template - needs customization |
| `clean.sh` | Clean build artifacts | Template - needs customization |

## Usage (After IT Agent Customizes)

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Build the project
./scripts/build.sh

# Run tests
./scripts/test.sh

# Run the application
./scripts/run.sh

# Clean build artifacts
./scripts/clean.sh
```

## IT Agent: How to Customize

1. **Get tech stack from Architect** - Know what language/framework is being used
2. **Edit each script** - Replace the TODO section with actual commands
3. **Test the scripts** - Make sure they work
4. **Remove instruction comments** - Clean up after customization

### Example: Node.js Project

```bash
# In build.sh:
npm install
npm run build

# In test.sh:
npm test

# In run.sh:
npm start

# In clean.sh:
rm -rf node_modules dist
```

### Example: Python Project

```bash
# In build.sh:
pip install -r requirements.txt

# In test.sh:
pytest

# In run.sh:
python main.py

# In clean.sh:
rm -rf __pycache__ *.egg-info .pytest_cache
```

## Adding New Scripts

1. Create your script in this folder
2. Add `#!/bin/bash` at the top
3. Make it executable: `chmod +x scripts/your-script.sh`
4. Document it in this README
