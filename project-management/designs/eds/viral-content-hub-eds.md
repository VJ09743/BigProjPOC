# External Design Specification: Viral Content Hub

## Architecture Overview

A client-side Single Page Application (SPA) using vanilla HTML, CSS, and JavaScript. The application fetches content directly from public APIs without requiring a backend server.

```
+-------------------+
|     Browser       |
|  (HTML/CSS/JS)    |
+--------+----------+
         |
         | HTTPS API Calls
         v
+--------+----------+
|   External APIs   |
|  - JokeAPI        |
|  - Meme API       |
|  - News API       |
+-------------------+
```

## Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Markup | HTML5 | Semantic, accessible structure |
| Styling | CSS3 | Flexbox/Grid for responsive layout |
| Logic | Vanilla JavaScript (ES6+) | No framework needed for simple SPA |
| HTTP | Fetch API | Native browser support |
| Hosting | Static files | Can be hosted anywhere |

## Component Design

### File Structure
```
modules/viral-content-hub/
├── src/
│   ├── index.html       # Main HTML page
│   ├── css/
│   │   └── styles.css   # Styling
│   └── js/
│       ├── app.js       # Main application logic
│       ├── api/
│       │   ├── jokes.js    # Joke API integration
│       │   ├── memes.js    # Meme API integration
│       │   └── news.js     # News API integration
│       └── utils/
│           └── helpers.js  # Utility functions
├── test/
│   └── ...              # Tests
└── Makefile             # Build configuration
```

### Module: API Integrations

#### Jokes API (jokes.js)
- **API**: JokeAPI (https://v2.jokeapi.dev)
- **Endpoint**: `GET /joke/Any?safe-mode`
- **Features**:
  - Safe mode enabled (no nsfw, religious, political, racist, sexist)
  - Returns single or two-part jokes
- **Response Handling**: Parse JSON, extract joke text

#### Memes API (memes.js)
- **API**: Meme API (https://meme-api.com) or Reddit API
- **Endpoint**: `GET /gimme` (from r/memes or similar subreddits)
- **Features**:
  - Returns image URL and post title
  - Subreddit filtering for safe content
- **Response Handling**: Display image with attribution

#### News API (news.js)
- **API**: GNews API (https://gnews.io) - free tier available
- **Endpoints**:
  - Sports: `GET /api/v4/top-headlines?category=sports`
  - Politics: `GET /api/v4/top-headlines?category=nation` (political news)
  - Tech: `GET /api/v4/top-headlines?category=technology`
- **Features**:
  - Free tier: 100 requests/day
  - No API key required for basic usage (or use free tier key)
- **Response Handling**: Extract title, description, source, URL

### Module: UI Components

#### Content Display Area
- Renders different content types (text, image, news card)
- Shows loading spinner during fetch
- Displays error messages gracefully
- Always shows source attribution with clickable link

#### Button Panel
- 5 buttons: Joke, Meme, Sports, Politics, Tech
- Visual feedback on click (active state)
- Disabled during loading to prevent spam clicks

## Data Flow

```
User Click → Button Handler → API Module → Fetch Request
                                              ↓
Display ← Content Renderer ← Response Parser ← API Response
```

## Interface Specifications

### API Module Interface
```javascript
// Each API module exports:
async function fetchContent() → Promise<{
  type: 'joke' | 'meme' | 'news',
  content: string | { title, body, image? },
  source: { name: string, url: string }
}>
```

### Content Renderer Interface
```javascript
function renderContent(contentData) → void
function showLoading() → void
function showError(message) → void
```

## Error Handling

| Error Type | User Message | Fallback |
|------------|--------------|----------|
| Network Error | "Unable to connect. Please check your internet." | Retry button |
| API Error | "Content unavailable. Try again later." | Retry button |
| Rate Limited | "Taking a breather. Try again in a moment." | Countdown timer |
| Content Filter | "Finding appropriate content..." | Auto-retry with different request |

## Caching Strategy

- **Jokes**: No caching (always fresh)
- **Memes**: Cache last 10 in memory to avoid repeats
- **News**: Cache for 5 minutes (reduce API calls)

## Security Considerations

1. **CORS**: All selected APIs support CORS for browser requests
2. **Content Safety**: API-level filtering enabled
3. **No Sensitive Data**: No user data collected or stored
4. **HTTPS Only**: All API calls over HTTPS

## Dependencies

### External APIs (No API Keys Required)
- JokeAPI: https://v2.jokeapi.dev (free, no key)
- Meme API: https://meme-api.com (free, no key)
- For news: Will use public RSS feeds or free news API

### Development Dependencies
- Node.js (for local dev server)
- http-server or similar (live reload)

## Constraints

1. API rate limits may affect heavy usage
2. Meme content from Reddit may occasionally contain inappropriate content despite filtering
3. News API free tiers have daily request limits
4. No backend = no server-side content filtering (rely on API filtering)
