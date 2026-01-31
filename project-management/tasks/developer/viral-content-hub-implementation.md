# Developer Task: Viral Content Hub Implementation

## Objective

Implement a single-page web application that displays jokes, memes, and news content from external APIs.

## Reference Documents
- EPS: `project-management/designs/eps/viral-content-hub-eps.md`
- EDS: `project-management/designs/eds/viral-content-hub-eds.md`

## Prerequisites
- IT Agent must set up the project structure and dev server first
- Review EDS for API endpoints and data structures

## Implementation Tasks

### Task 1: HTML Structure (`index.html`)

Create the main HTML page with:
- Header with title "Viral Content Hub"
- Button panel with 5 buttons (Joke, Meme, Sports, Politics, Tech)
- Content display area
- Loading indicator (hidden by default)
- Error message area (hidden by default)
- Source attribution section

**Acceptance Criteria**:
- [ ] Semantic HTML5 structure
- [ ] Accessible button labels
- [ ] Proper meta tags for responsiveness
- [ ] Links to CSS and JS files

### Task 2: CSS Styling (`css/styles.css`)

Create responsive styles for:
- Clean, modern layout
- Button panel (flexbox, gap between buttons)
- Content area styling
- Loading spinner animation
- Error message styling
- Mobile-responsive design
- Hover/active states for buttons

**Acceptance Criteria**:
- [ ] Works on mobile (320px+), tablet, desktop
- [ ] Buttons have visual feedback
- [ ] Loading spinner is visible
- [ ] Content area properly sized for different content types

### Task 3: Joke API Integration (`js/api/jokes.js`)

Implement joke fetching:
```javascript
// API: https://v2.jokeapi.dev/joke/Any?safe-mode
// Response types: single or twopart jokes
```

**Acceptance Criteria**:
- [ ] Uses safe-mode parameter
- [ ] Handles single jokes (joke field)
- [ ] Handles two-part jokes (setup + delivery)
- [ ] Returns standardized content object
- [ ] Includes source attribution

### Task 4: Meme API Integration (`js/api/memes.js`)

Implement meme fetching:
```javascript
// API: https://meme-api.com/gimme
// Alternative: https://meme-api.com/gimme/wholesomememes
```

**Acceptance Criteria**:
- [ ] Fetches from appropriate subreddit
- [ ] Returns image URL and title
- [ ] Includes Reddit post link as source
- [ ] Handles NSFW filtering (use wholesome subreddits)

### Task 5: News API Integration (`js/api/news.js`)

Implement news fetching for 3 categories:
```javascript
// Using GNews API or NewsData.io free tier
// Categories: sports, politics (world/nation), technology
```

**Acceptance Criteria**:
- [ ] Fetches sports news
- [ ] Fetches political news
- [ ] Fetches tech news
- [ ] Returns headline, description, image (if available), source URL
- [ ] Handles API rate limiting

### Task 6: Main Application Logic (`js/app.js`)

Implement:
- Button click handlers
- Loading state management
- Content rendering
- Error handling
- API module integration

**Acceptance Criteria**:
- [ ] Each button fetches correct content type
- [ ] Loading indicator shown during fetch
- [ ] Error messages displayed gracefully
- [ ] Content rendered with source link
- [ ] Buttons disabled during loading

### Task 7: Helper Utilities (`js/utils/helpers.js`)

Implement:
- Content type detection
- HTML escaping for safety
- Date formatting (for news)
- Error message formatting

**Acceptance Criteria**:
- [ ] Utility functions are reusable
- [ ] Proper error handling
- [ ] No XSS vulnerabilities

## Module Location

All code goes in: `modules/viral-content-hub/src/`

## Definition of Done

- [ ] All 5 buttons work correctly
- [ ] Content displays with source attribution
- [ ] Loading states visible
- [ ] Error states handled
- [ ] Responsive design works
- [ ] No console errors
- [ ] Code is clean and documented

## Status

Pending - Waiting for IT Agent to set up environment
