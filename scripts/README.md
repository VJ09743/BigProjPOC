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

**Linux/macOS:**
```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Build / Test / Run / Clean
./scripts/build.sh
./scripts/test.sh
./scripts/run.sh
./scripts/clean.sh
```

**Windows (PowerShell / Git Bash):**
```powershell
# No chmod needed on Windows. Run with bash (from Git Bash) or sh:
bash scripts/build.sh
bash scripts/test.sh
bash scripts/run.sh
bash scripts/clean.sh

# Or if using PowerShell scripts (.ps1), create equivalents:
# .\scripts\build.ps1
```

> **Note for IT Agent**: When creating scripts for cross-platform projects, consider providing both `.sh` (Linux/macOS) and `.ps1` or `.bat` (Windows) versions. Alternatively, use a `Makefile` or `package.json` scripts which work cross-platform.

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

**Linux/macOS:**
1. Create your script in this folder
2. Add `#!/bin/bash` at the top
3. Make it executable: `chmod +x scripts/your-script.sh`
4. Document it in this README

**Windows:**
1. Create a `.ps1` (PowerShell) or `.bat` script in this folder
2. Or use the `.sh` scripts via Git Bash: `bash scripts/your-script.sh`
3. Document it in this README

**Cross-platform alternative:** Use `Makefile` targets or `package.json` scripts instead of shell scripts for maximum portability.
