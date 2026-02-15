# Family-Friendly Joke Website

A PG-13 rated family-friendly joke website with content browsing, search, and user interaction features.

## Features

- **6 Joke Categories**: Dad jokes, One-liners, Knock-knock, Riddles, Animal jokes, Tech jokes
- **Content Browsing**: Random jokes, category filtering, search functionality
- **User Interaction**: Rating system, content submission, social sharing  
- **Family-Safe Content**: Automated PG-13 filtering and manual moderation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Backend**: Node.js 18+ with Express.js
- **Database**: SQLite 3.x with full-text search
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tools**: Browserify, concat-cli, nodemon

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm package manager

### Installation
```bash
# Install dependencies
npm install

# Seed database with initial jokes
npm run seed

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Available Scripts

- `npm start` - Run production server
- `npm run dev` - Start development server with auto-reload  
- `npm run build` - Build CSS and JavaScript bundles
- `npm test` - Run test suite
- `npm run seed` - Populate database with initial jokes

## Project Structure

```
src/
├── server/              # Express.js backend
│   ├── app.js          # Main application entry
│   ├── routes/         # API route handlers  
│   ├── models/         # Database models
│   ├── middleware/     # Content filtering & validation
│   └── utils/          # Helper functions
├── public/             # Static frontend assets
│   ├── css/           # Stylesheets
│   ├── js/            # Client-side JavaScript
│   ├── images/        # Static images
│   └── index.html     # Main HTML template
└── data/              # Database and seed files
```

## Development Notes

- Environment variables configured in `.env` file
- SQLite database automatically created on first run
- Content moderation queue accessible at `/admin` 
- All user submissions require manual approval
- Rate limiting enabled for content submissions (5 per 15 minutes)

## Database Schema

- **categories**: 6 joke categories with slugs
- **jokes**: Main content table with ratings and status
- **moderation_queue**: User submissions awaiting review
- **filter_rules**: PG-13 content validation rules

## Security Features

- Content filtering for family-appropriate material
- Rate limiting on submissions to prevent spam
- Input validation and sanitization
- CORS protection and security headers via Helmet.js

## Deployment

Ready for deployment to any Node.js hosting platform:
- Heroku, Railway, Vercel, DigitalOcean App Platform
- Requires Node.js 18+ runtime
- SQLite database included (no external DB needed)
- Minimal resource requirements (512MB RAM recommended)

---

**Status**: ✅ Ready for Development  
**Next Phase**: Developer implementation of backend APIs and frontend interface