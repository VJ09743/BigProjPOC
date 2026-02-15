# Build Configuration for Joke Website

This directory contains build configuration files for the family-friendly joke website.

## Build Process

### CSS Build
- Concatenates all CSS files from `src/public/css/` 
- Outputs to `build/main.css`
- Command: `npm run build:css`

### JavaScript Build  
- Bundles frontend JavaScript using Browserify
- Entry point: `src/public/js/main.js`
- Outputs to `build/bundle.js`
- Command: `npm run build:js`

### Full Build
- Runs both CSS and JS builds
- Command: `npm run build`

## Development
- Use `npm run dev` for development server with auto-reload
- Server runs on `http://localhost:3000`
- Uses nodemon for automatic restart on file changes

## Testing
- Jest test runner configured
- Command: `npm test`
- Test files should be placed in `/test` directory

## Database Seeding
- Initial jokes data seeding
- Command: `npm run seed`
- Populates database with curated family-friendly jokes

## Environment Variables
- Configuration stored in `.env` file
- Never commit `.env` to version control  
- Copy `.env.example` for new environments