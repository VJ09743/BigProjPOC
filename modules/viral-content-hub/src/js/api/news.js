/**
 * News API Integration
 * Uses multiple sources for reliability
 */

import { fetchWithTimeout, escapeHtml, truncateText, getRandomItem } from '../utils/helpers.js';

// News categories
const CATEGORIES = {
    sports: 'sports',
    politics: 'nation',
    tech: 'technology'
};

// GNews API (free tier - 100 requests/day)
const GNEWS_API_URL = 'https://gnews.io/api/v4/top-headlines';
// Note: For production, store API key securely. This is a demo key placeholder.
const GNEWS_API_KEY = 'demo'; // Replace with actual key for production

// Fallback: Using Reddit for news when API unavailable
const REDDIT_NEWS_SUBREDDITS = {
    sports: ['sports', 'nfl', 'nba', 'soccer'],
    politics: ['worldnews', 'news'],
    tech: ['technology', 'tech', 'gadgets']
};

// Cache for news items to rotate through
const newsCache = {
    sports: [],
    politics: [],
    tech: []
};

let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch news by category
 * @param {string} category - 'sports', 'politics', or 'tech'
 * @returns {Promise<object>} - News content object
 */
export async function fetchNews(category) {
    if (!CATEGORIES[category]) {
        throw new Error(`Invalid category: ${category}`);
    }

    try {
        // Try primary API first
        return await fetchFromGNews(category);
    } catch (error) {
        console.warn('GNews API failed, falling back to Reddit:', error.message);
        // Fallback to Reddit
        return await fetchFromReddit(category);
    }
}

/**
 * Fetch news from GNews API
 * @param {string} category - News category
 * @returns {Promise<object>} - News content object
 */
async function fetchFromGNews(category) {
    const gnewsCategory = CATEGORIES[category];
    const url = `${GNEWS_API_URL}?category=${gnewsCategory}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
        throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
        throw new Error('No articles found');
    }

    // Get random article from results
    const article = getRandomItem(data.articles);
    return formatGNewsResponse(article, category);
}

/**
 * Fetch news from Reddit as fallback
 * @param {string} category - News category
 * @returns {Promise<object>} - News content object
 */
async function fetchFromReddit(category) {
    const subreddits = REDDIT_NEWS_SUBREDDITS[category];
    const subreddit = getRandomItem(subreddits);
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
    }

    const data = await response.json();
    const posts = data.data.children
        .filter(post => !post.data.over_18) // Filter NSFW
        .filter(post => !post.data.stickied) // Skip stickied posts
        .filter(post => post.data.url); // Must have URL

    if (posts.length === 0) {
        throw new Error('No suitable posts found');
    }

    const post = getRandomItem(posts);
    return formatRedditResponse(post.data, category, subreddit);
}

/**
 * Format GNews response
 * @param {object} article - Article from GNews
 * @param {string} category - Category
 * @returns {object} - Formatted content object
 */
function formatGNewsResponse(article, category) {
    return {
        type: 'news',
        category: category,
        title: escapeHtml(article.title),
        description: escapeHtml(truncateText(article.description, 200)),
        imageUrl: article.image,
        publishedAt: article.publishedAt,
        source: {
            name: article.source?.name || 'News Source',
            url: article.url
        }
    };
}

/**
 * Format Reddit response as news
 * @param {object} post - Reddit post data
 * @param {string} category - Category
 * @param {string} subreddit - Subreddit name
 * @returns {object} - Formatted content object
 */
function formatRedditResponse(post, category, subreddit) {
    return {
        type: 'news',
        category: category,
        title: escapeHtml(post.title),
        description: escapeHtml(truncateText(post.selftext || 'Click to read more', 200)),
        imageUrl: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : null,
        publishedAt: new Date(post.created_utc * 1000).toISOString(),
        upvotes: post.ups,
        source: {
            name: `r/${subreddit}`,
            url: `https://reddit.com${post.permalink}`
        }
    };
}

// Export individual category fetchers for convenience
export const fetchSportsNews = () => fetchNews('sports');
export const fetchPoliticsNews = () => fetchNews('politics');
export const fetchTechNews = () => fetchNews('tech');
