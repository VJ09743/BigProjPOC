/**
 * Joke API Integration
 * Uses JokeAPI - https://v2.jokeapi.dev
 */

import { fetchWithTimeout, escapeHtml } from '../utils/helpers.js';

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/Any';

// Safe mode flags to filter inappropriate content
const SAFE_MODE_FLAGS = 'nsfw,religious,political,racist,sexist,explicit';

/**
 * Fetch a random joke
 * @returns {Promise<object>} - Joke content object
 */
export async function fetchJoke() {
    const url = `${JOKE_API_URL}?blacklistFlags=${SAFE_MODE_FLAGS}&type=single,twopart`;

    try {
        const response = await fetchWithTimeout(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.message || 'Failed to fetch joke');
        }

        return formatJokeResponse(data);
    } catch (error) {
        console.error('Error fetching joke:', error);
        throw new Error('Unable to fetch joke. Please try again.');
    }
}

/**
 * Format API response to standard content object
 * @param {object} data - API response
 * @returns {object} - Formatted content object
 */
function formatJokeResponse(data) {
    const content = {
        type: 'joke',
        source: {
            name: 'JokeAPI',
            url: 'https://jokeapi.dev'
        }
    };

    if (data.type === 'single') {
        content.joke = escapeHtml(data.joke);
        content.isTwoPart = false;
    } else if (data.type === 'twopart') {
        content.setup = escapeHtml(data.setup);
        content.delivery = escapeHtml(data.delivery);
        content.isTwoPart = true;
    }

    content.category = data.category;

    return content;
}
