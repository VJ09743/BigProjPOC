# FamilyJokes Website

A family-friendly joke website featuring clean, PG-13 rated humor across multiple categories.

## Features

- 🎭 **6 Joke Categories**: Dad jokes, one-liners, knock-knock jokes, riddles, animal jokes, and tech jokes
- 😄 **Easy Browsing**: Simple, intuitive interface for quick joke discovery
- 🔍 **Search**: Find jokes by keyword across all categories
- ⭐ **Rating System**: Rate jokes to help others find the best content
- 📝 **User Submissions**: Community-driven content with moderation
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🛡️ **Content Filtering**: Automatic PG-13 content validation
- 👨‍👩‍👧‍👦 **Family-Safe**: All content reviewed for appropriateness

## Technology Stack

### Backend
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Web application framework
- **SQLite 3.x**: Lightweight database
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: Rate limiting for submissions

### Frontend  
- **Vanilla JavaScript**: Universal compatibility
- **HTML5 & CSS3**: Modern web standards
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript

### Development Tools
- **Nodemon**: Development server with hot reload
- **Jest**: Testing framework
- **Browserify**: JavaScript bundling
- **Concat-CLI**: CSS concatenation

## Quick Start

### 1. Install Dependencies
```bash
cd modules/joke-website
npm install
```

### 2. Seed Database with Sample Jokes
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

The website will be available at http://localhost:3000

### 4. Production Build
```bash
npm run build
npm start
```

## Project Structure

```
joke-website/
├── src/
│   ├── server/                 # Backend application
│   │   ├── models/            # Database models
│   │   │   ├── Database.js    # SQLite connection & schema
│   │   │   ├── Joke.js        # Joke data operations
│   │   │   └── Category.js    # Category management
│   │   ├── routes/            # API endpoints
│   │   │   ├── jokes.js       # Joke CRUD operations
│   │   │   ├── categories.js  # Category endpoints
│   │   │   └── admin.js       # Admin functionality
│   │   ├── middleware/        # Express middleware
│   │   │   └── contentFilter.js # PG-13 content validation
│   │   ├── seeds/            # Database seeding
│   │   │   └── seedDatabase.js # Sample joke data
│   │   └── app.js            # Main Express application
│   └── public/               # Frontend assets
│       ├── index.html        # Main HTML template
│       ├── css/
│       │   └── styles.css    # Responsive CSS styles
│       └── js/
│           └── app.js        # Frontend JavaScript app
├── databases/                # SQLite database files
├── package.json             # Dependencies & scripts
└── README.md               # This file
```

## API Endpoints

### Jokes
- `GET /api/jokes/random` - Get a random joke
- `GET /api/jokes/category/:slug` - Get random joke from category
- `GET /api/jokes/search?q=keyword` - Search jokes by keyword
- `POST /api/jokes/:id/rate` - Rate a joke (1-5 stars)
- `POST /api/jokes/submit` - Submit new joke for moderation

### Categories
- `GET /api/categories` - Get all joke categories

### Admin
- `GET /api/admin/moderation` - Get pending joke submissions
- `POST /api/admin/moderation/:id/approve` - Approve submitted joke
- `POST /api/admin/moderation/:id/reject` - Reject submitted joke

## Database Schema

### Categories
- `id` - Primary key
- `name` - Display name (e.g., "Dad Jokes")  
- `slug` - URL-friendly identifier (e.g., "dad-jokes")
- `description` - Category description
- `is_active` - Enable/disable category

### Jokes
- `id` - Primary key
- `category_id` - Foreign key to categories
- `setup` - Joke setup/question
- `punchline` - Joke punchline/answer (optional for some riddles)
- `status` - approved, pending, rejected
- `submitter_name` - Optional submitter name
- `created_at` - Submission timestamp
- `updated_at` - Last modified timestamp

### Ratings & Moderation
- `joke_ratings` - User ratings (1-5 stars)
- `moderation_queue` - Pending submissions
- `filter_rules` - Content filtering patterns

## Content Guidelines

### Submission Standards
- **Family-Friendly**: All jokes must be appropriate for PG-13 audiences
- **No Offensive Content**: Prohibited: profanity, discrimination, adult themes
- **Quality Control**: Jokes reviewed for humor quality and appropriateness
- **Original Content**: Encourage original jokes, but classic clean jokes welcome

### Moderation Workflow
1. User submits joke via form
2. Automatic content filter performs initial screening
3. Joke enters moderation queue for human review
4. Admin approves/rejects with optional feedback
5. Approved jokes published to appropriate category

## Development

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development server with hot reload
npm run seed       # Seed database with sample jokes
npm run build      # Build frontend assets
npm run test       # Run test suite
npm run lint       # Check code style
```

### Adding New Categories
1. Update category list in `seedDatabase.js`
2. Add category button to HTML template
3. Update CSS styling for new category
4. Test category filtering functionality

### Content Moderation
Admin interface available at `/api/admin/` endpoints for:
- Reviewing submitted jokes
- Managing content filters  
- Monitoring user activity

## Performance & Scalability

### Current Architecture
- **SQLite Database**: Perfect for up to 100K jokes
- **File-based Storage**: Simple deployment, no external dependencies
- **In-Memory Caching**: Fast joke retrieval
- **Static Assets**: CSS/JS served efficiently by Express

### Scaling Considerations
For larger deployments:
- Migrate to PostgreSQL/MySQL for better concurrency
- Add Redis caching layer
- Implement CDN for static assets
- Consider microservices architecture

## Contributing

1. Follow the existing code style and patterns
2. All new jokes must be family-friendly (PG-13)
3. Test thoroughly across different devices
4. Update documentation for new features

## License & Credits

Built as part of the AI-Assisted Agentic Workflow template.
Content contributed by the community following PG-13 family-friendly guidelines.

---

**FamilyJokes** - Spreading smiles one joke at a time! 🎭😄