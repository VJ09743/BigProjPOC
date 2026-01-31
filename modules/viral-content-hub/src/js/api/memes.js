/**
 * Meme API Integration
 * Uses Meme API - https://meme-api.com
 */

import { fetchWithTimeout, escapeHtml } from '../utils/helpers.js';

// Use wholesome/safe subreddits for family-friendly content
const SAFE_SUBREDDITS = [
    'wholesomememes',
    'memes',
    'me_irl',
    'AdviceAnimals'
];

const MEME_API_URL = 'https://meme-api.com/gimme';

// Cache to avoid showing same meme twice in a row
let lastMemeUrl = '';

/**
 * Fetch a random meme
 * @returns {Promise<object>} - Meme content object
 */
export async function fetchMeme() {
    // Rotate through safe subreddits
    const subreddit = SAFE_SUBREDDITS[Math.floor(Math.random() * SAFE_SUBREDDITS.length)];
    const url = `${MEME_API_URL}/${subreddit}`;

    try {
        const response = await fetchWithTimeout(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Skip NSFW content (extra safety check)
        if (data.nsfw) {
            // Try again with wholesomememes
            return fetchMemeFromWholesome();
        }

        // Avoid same meme twice
        if (data.url === lastMemeUrl) {
            return fetchMeme(); // Retry for different meme
        }

        lastMemeUrl = data.url;
        return formatMemeResponse(data);
    } catch (error) {
        console.error('Error fetching meme:', error);
        throw new Error('Unable to fetch meme. Please try again.');
    }
}

/**
 * Fallback to wholesome memes subreddit
 * @returns {Promise<object>} - Meme content object
 */
async function fetchMemeFromWholesome() {
    const url = `${MEME_API_URL}/wholesomememes`;

    const response = await fetchWithTimeout(url);
    const data = await response.json();

    return formatMemeResponse(data);
}

/**
 * Format API response to standard content object
 * @param {object} data - API response
 * @returns {object} - Formatted content object
 */
function formatMemeResponse(data) {
    return {
        type: 'meme',
        title: escapeHtml(data.title),
        imageUrl: data.url,
        subreddit: data.subreddit,
        author: data.author,
        upvotes: data.ups,
        source: {
            name: `r/${data.subreddit}`,
            url: data.postLink
        }
    };
}
