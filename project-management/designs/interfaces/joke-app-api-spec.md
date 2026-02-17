# API Specification - Joke Web Application

## API Overview

**Base URL**: `http://localhost:3001/api`  
**Version**: v1  
**Protocol**: RESTful HTTP API  
**Content Type**: `application/json`  
**Authentication**: Session-based (anonymous sessions)

## API Design Principles

1. **RESTful**: Standard HTTP methods and status codes
2. **Consistent**: Uniform response format across all endpoints
3. **Performance**: Pagination, caching headers, efficient queries
4. **Error Handling**: Descriptive error messages with proper HTTP status codes
5. **Validation**: Input validation with clear error responses

## Standard Response Format

### Success Response
```json
{
    "success": true,
    "data": { /* response data */ },
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "totalPages": 8
    },
    "timestamp": "2026-02-17T21:45:00.000Z"
}
```

### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "setup",
                "message": "Setup text is required"
            }
        ]
    },
    "timestamp": "2026-02-17T21:45:00.000Z"
}
```

## Authentication & Sessions

### Session Management
All requests include a session identifier for tracking user preferences, ratings, and favorites.

**Headers**:
```http
X-Session-ID: uuid-v4-string
```

If no session ID provided, server generates one and returns it in response headers:
```http
X-Generated-Session-ID: new-uuid-v4-string
```

## Core API Endpoints

### 1. Categories API

#### GET /api/categories
Get all active joke categories.

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Dad Jokes",
            "slug": "dad-jokes",
            "description": "Classic groan-worthy dad humor",
            "colorHex": "#8B5CF6",
            "iconName": "user-tie",
            "jokeCount": 234
        }
    ]
}
```

### 2. Jokes API

#### GET /api/jokes
Get jokes with filtering and pagination.

**Query Parameters**:
- `category` (string): Category slug to filter by
- `featured` (boolean): Filter for featured jokes only
- `page` (number): Page number (default: 1)  
- `limit` (number): Items per page (default: 20, max: 100)
- `sort` (string): Sort by `latest`, `popular`, `rating` (default: `latest`)

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 123,
            "setup": "Why don't scientists trust atoms?",
            "punchline": "Because they make up everything!",
            "contentRating": "PG",
            "isFeatured": false,
            "viewCount": 45,
            "avgRating": 4.2,
            "ratingCount": 12,
            "category": {
                "id": 2,
                "name": "Science Jokes",
                "slug": "science-jokes",
                "colorHex": "#10B981"
            },
            "createdAt": "2026-02-15T10:30:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "totalPages": 8,
        "category": "science-jokes"
    }
}
```

#### GET /api/jokes/random
Get a random joke, optionally filtered by category.

**Query Parameters**:
- `category` (string): Category slug to filter by
- `exclude` (array): Joke IDs to exclude from selection

**Response**:
```json
{
    "success": true,
    "data": {
        "id": 456,
        "setup": "What do you call a fish wearing a bowtie?",
        "punchline": "Sofishticated!",
        "contentRating": "PG",
        "isFeatured": true,
        "avgRating": 4.7,
        "ratingCount": 23,
        "category": {
            "name": "Animal Jokes",
            "slug": "animal-jokes",
            "colorHex": "#EF4444"
        }
    }
}
```

#### GET /api/jokes/:id
Get a specific joke by ID.

**Response**:
```json
{
    "success": true,
    "data": {
        "id": 789,
        "setup": "Why did the scarecrow win an award?",
        "punchline": "He was outstanding in his field!",
        "contentRating": "G",
        "viewCount": 89,
        "avgRating": 3.9,
        "ratingCount": 17,
        "category": {
            "name": "Dad Jokes",
            "slug": "dad-jokes"
        },
        "isUserFavorite": true,
        "userRating": 5
    }
}
```

#### POST /api/jokes/:id/view
Increment view count for a joke (analytics).

**Response**:
```json
{
    "success": true,
    "data": {
        "viewCount": 90
    }
}
```

### 3. Search API

#### GET /api/search
Search jokes by content using full-text search.

**Query Parameters**:
- `q` (string, required): Search query
- `category` (string): Limit search to specific category
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20, max: 50)

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 234,
            "setup": "Why don't eggs tell jokes?",
            "punchline": "They'd crack each other up!",
            "contentRating": "G",
            "avgRating": 4.1,
            "category": {
                "name": "Food Jokes",
                "slug": "food-jokes"
            },
            "relevanceScore": 0.85
        }
    ],
    "meta": {
        "query": "eggs",
        "totalMatches": 12,
        "searchTime": "23ms"
    }
}
```

### 4. Ratings API

#### POST /api/jokes/:id/rating
Rate a joke (1-5 stars).

**Request Body**:
```json
{
    "rating": 5
}
```

**Response**:
```json
{
    "success": true,
    "data": {
        "jokeId": 123,
        "userRating": 5,
        "avgRating": 4.3,
        "ratingCount": 18
    }
}
```

#### DELETE /api/jokes/:id/rating
Remove user's rating for a joke.

**Response**:
```json
{
    "success": true,
    "data": {
        "jokeId": 123,
        "avgRating": 4.1,
        "ratingCount": 17
    }
}
```

### 5. Favorites API

#### GET /api/favorites
Get user's favorite jokes.

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 456,
            "setup": "What's the best thing about Switzerland?",
            "punchline": "I don't know, but the flag is a big plus!",
            "favoritedAt": "2026-02-16T14:22:00.000Z",
            "category": {
                "name": "Geography Jokes",
                "slug": "geography-jokes"
            }
        }
    ]
}
```

#### POST /api/jokes/:id/favorite
Add joke to user's favorites.

**Response**:
```json
{
    "success": true,
    "data": {
        "jokeId": 456,
        "isFavorite": true,
        "favoritedAt": "2026-02-17T21:45:00.000Z"
    }
}
```

#### DELETE /api/jokes/:id/favorite
Remove joke from user's favorites.

**Response**:
```json
{
    "success": true,
    "data": {
        "jokeId": 456,
        "isFavorite": false
    }
}
```

### 6. Submissions API

#### POST /api/submissions
Submit a new joke for review.

**Request Body**:
```json
{
    "categoryId": 1,
    "setup": "Why did the programmer quit his job?",
    "punchline": "He didn't get arrays!"
}
```

**Validation Rules**:
- `setup`: Required, 10-500 characters, PG-13 content
- `punchline`: Required, 5-300 characters, PG-13 content  
- `categoryId`: Must be valid active category

**Response**:
```json
{
    "success": true,
    "data": {
        "id": 892,
        "status": "pending",
        "estimatedReviewTime": "24-48 hours",
        "submittedAt": "2026-02-17T21:45:00.000Z"
    }
}
```

#### GET /api/submissions
Get user's submitted jokes and their status.

**Response**:
```json
{
    "success": true,
    "data": [
        {
            "id": 892,
            "setup": "Why did the programmer quit his job?",
            "punchline": "He didn't get arrays!",
            "status": "approved",
            "submittedAt": "2026-02-16T10:30:00.000Z",
            "reviewedAt": "2026-02-17T08:15:00.000Z",
            "approvedJokeId": 1205
        }
    ]
}
```

## Utility Endpoints

### Health Check
#### GET /api/health
Check API health and database connectivity.

**Response**:
```json
{
    "success": true,
    "data": {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0",
        "uptime": 3600,
        "jokeCount": 1247
    }
}
```

### Statistics
#### GET /api/stats
Get application statistics.

**Response**:
```json
{
    "success": true,
    "data": {
        "totalJokes": 1247,
        "totalCategories": 8,
        "totalRatings": 3456,
        "avgRating": 4.2,
        "mostPopularCategory": "Dad Jokes",
        "newestJokes": 23,
        "pendingSubmissions": 5
    }
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate action)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Error Codes
```javascript
const ERROR_CODES = {
    VALIDATION_ERROR: 'Invalid input data',
    JOKE_NOT_FOUND: 'Joke not found',
    CATEGORY_NOT_FOUND: 'Category not found',
    CONTENT_INAPPROPRIATE: 'Content violates PG-13 guidelines',
    DUPLICATE_RATING: 'User has already rated this joke',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please slow down',
    DATABASE_ERROR: 'Database operation failed'
};
```

## Performance & Caching

### Response Caching
```http
# Static data (categories)
Cache-Control: public, max-age=3600

# Dynamic data (jokes)  
Cache-Control: private, max-age=300

# User-specific data (favorites)
Cache-Control: private, no-cache
```

### Rate Limiting
- **Search**: 30 requests per minute per session
- **Submissions**: 5 submissions per hour per session
- **Ratings**: 60 ratings per hour per session
- **General**: 100 requests per minute per session

### Pagination Limits
- **Maximum page size**: 100 items
- **Default page size**: 20 items
- **Search results**: Limited to 50 items per page

## Content Validation

### Automated Content Filtering
All user-submitted content (jokes, search queries) is automatically screened for:
- **Profanity detection**: Block inappropriate language
- **Content rating**: Ensure PG-13 compliance
- **Spam detection**: Prevent duplicate or low-quality submissions
- **Length validation**: Enforce character limits

### Manual Review Process
1. **Automated screening** flags potential issues
2. **Pending status** for manual review queue
3. **24-48 hour review SLA** for submissions
4. **Approval/rejection** with optional feedback

---

**API Documentation Status**: Complete  
**Created by**: Architect Agent  
**Date**: 2026-02-17  
**Performance Target**: <200ms average response time  
**Next Phase**: Frontend Architecture Design