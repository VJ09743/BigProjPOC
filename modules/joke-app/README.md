# Example Module

This is a template module. Copy this folder to create new modules for your project.

## Structure

```
example-module/
├── src/              # Source code goes here
├── test/             # Tests go here
├── release/          # Release build output (gitignored)
├── debug/            # Debug build output (gitignored)
├── build-config/     # Build configuration files
├── Makefile          # Build script
└── README.md         # This file
```

## Quick Start

1. **Rename this folder** to your module name
2. **Add source code** to `src/`
3. **Add tests** to `test/`
4. **Update the Makefile** with your build commands
5. **Build**:
   ```bash
   make release   # Production build
   make debug     # Debug build
   make test      # Run tests
   ```

## Customizing the Makefile

Edit `Makefile` to configure:
- Compiler and flags
- Source file patterns
- Build output names
- Test commands

## Dependencies

List any dependencies this module requires:
- (none yet)

## API / Interfaces

Document this module's public interfaces here:
- (to be defined)

## Notes

- Delete this README content and replace with your module documentation
- Keep the folder structure consistent across modules
