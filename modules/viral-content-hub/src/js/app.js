/**
 * Viral Content Hub - Main Application
 * Coordinates UI interactions and content display
 */

import { fetchJoke } from './api/jokes.js';
import { fetchMeme } from './api/memes.js';
import { fetchNews } from './api/news.js';
import { formatDate } from './utils/helpers.js';

// DOM Elements
const elements = {
    buttons: document.querySelectorAll('.content-btn'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    content: document.getElementById('content'),
    source: document.getElementById('source'),
    sourceLink: document.getElementById('source-link')
};

// Current state
let currentType = null;
let isLoading = false;

/**
 * Initialize the application
 */
function init() {
    // Add click handlers to buttons
    elements.buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    // Retry button handler
    elements.retryBtn.addEventListener('click', handleRetry);

    console.log('Viral Content Hub initialized!');
}

/**
 * Handle content button click
 * @param {Event} event - Click event
 */
async function handleButtonClick(event) {
    if (isLoading) return;

    const button = event.target;
    const type = button.dataset.type;

    currentType = type;
    setActiveButton(button);

    await fetchAndDisplayContent(type);
}

/**
 * Handle retry button click
 */
async function handleRetry() {
    if (currentType) {
        await fetchAndDisplayContent(currentType);
    }
}

/**
 * Set active button state
 * @param {HTMLElement} activeButton - The clicked button
 */
function setActiveButton(activeButton) {
    elements.buttons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

/**
 * Fetch and display content based on type
 * @param {string} type - Content type (joke, meme, sports, politics, tech)
 */
async function fetchAndDisplayContent(type) {
    showLoading();

    try {
        let content;

        switch (type) {
            case 'joke':
                content = await fetchJoke();
                break;
            case 'meme':
                content = await fetchMeme();
                break;
            case 'sports':
                content = await fetchNews('sports');
                break;
            case 'politics':
                content = await fetchNews('politics');
                break;
            case 'tech':
                content = await fetchNews('tech');
                break;
            default:
                throw new Error('Unknown content type');
        }

        displayContent(content);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Show loading state
 */
function showLoading() {
    isLoading = true;
    elements.buttons.forEach(btn => btn.disabled = true);
    elements.loading.classList.remove('hidden');
    elements.error.classList.add('hidden');
    elements.content.classList.add('hidden');
    elements.source.classList.add('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
    isLoading = false;
    elements.buttons.forEach(btn => btn.disabled = false);
    elements.loading.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    hideLoading();
    elements.errorMessage.textContent = message;
    elements.error.classList.remove('hidden');
    elements.content.classList.add('hidden');
    elements.source.classList.add('hidden');
}

/**
 * Display content based on type
 * @param {object} contentData - Content data object
 */
function displayContent(contentData) {
    hideLoading();
    elements.error.classList.add('hidden');
    elements.content.classList.remove('hidden');

    let html = '';

    switch (contentData.type) {
        case 'joke':
            html = renderJoke(contentData);
            break;
        case 'meme':
            html = renderMeme(contentData);
            break;
        case 'news':
            html = renderNews(contentData);
            break;
    }

    elements.content.innerHTML = html;

    // Update source
    if (contentData.source) {
        elements.sourceLink.textContent = contentData.source.name;
        elements.sourceLink.href = contentData.source.url;
        elements.source.classList.remove('hidden');
    }
}

/**
 * Render joke content
 * @param {object} joke - Joke data
 * @returns {string} - HTML string
 */
function renderJoke(joke) {
    if (joke.isTwoPart) {
        return `
            <div class="joke-container">
                <p class="joke-setup">${joke.setup}</p>
                <p class="joke-delivery">${joke.delivery}</p>
            </div>
        `;
    } else {
        return `
            <div class="joke-container">
                <p class="joke-text">${joke.joke}</p>
            </div>
        `;
    }
}

/**
 * Render meme content
 * @param {object} meme - Meme data
 * @returns {string} - HTML string
 */
function renderMeme(meme) {
    return `
        <div class="meme-container">
            <p class="meme-title">${meme.title}</p>
            <img class="meme-image" src="${meme.imageUrl}" alt="${meme.title}" loading="lazy">
        </div>
    `;
}

/**
 * Render news content
 * @param {object} news - News data
 * @returns {string} - HTML string
 */
function renderNews(news) {
    const imageHtml = news.imageUrl
        ? `<img class="news-image" src="${news.imageUrl}" alt="" loading="lazy">`
        : '';

    const dateHtml = news.publishedAt
        ? `<span class="news-date">${formatDate(news.publishedAt)}</span>`
        : '';

    return `
        <div class="news-card">
            ${imageHtml}
            <h2 class="news-title">${news.title}</h2>
            <p class="news-description">${news.description}</p>
            <p class="news-meta">
                ${dateHtml}
                ${news.upvotes ? `<span class="news-upvotes">${news.upvotes.toLocaleString()} upvotes</span>` : ''}
            </p>
        </div>
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
