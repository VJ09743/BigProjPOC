/**
 * FamilyJokes Web Application
 * Frontend JavaScript controller for the family-friendly joke website
 */

class FamilyJokesApp {
    constructor() {
        this.currentJoke = null;
        this.currentCategory = 'all';
        this.currentView = 'browse';
        this.searchResults = [];
        this.isLoading = false;
        
        // DOM elements
        this.elements = {};
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.cacheElements();
            this.bindEvents();
            await this.loadCategories();
            await this.loadRandomJoke();
            
            console.log('🎭 FamilyJokes app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load the application. Please refresh the page.');
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        // Navigation
        this.elements.navBtns = document.querySelectorAll('.nav-btn');
        this.elements.views = document.querySelectorAll('.view');
        
        // Browse view
        this.elements.categoryBtns = document.querySelectorAll('.category-btn');
        this.elements.jokeCard = document.getElementById('current-joke');
        this.elements.jokeSetup = this.elements.jokeCard?.querySelector('.joke-setup');
        this.elements.jokePunchline = this.elements.jokeCard?.querySelector('.joke-punchline');
        this.elements.jokeReveal = document.getElementById('joke-reveal');
        this.elements.revealBtn = this.elements.jokeReveal?.querySelector('.reveal-btn');
        this.elements.categoryTag = this.elements.jokeCard?.querySelector('.category-tag');
        this.elements.ratingValue = this.elements.jokeCard?.querySelector('.rating-value');
        this.elements.ratingCount = this.elements.jokeCard?.querySelector('.rating-count');
        this.elements.rateBtns = this.elements.jokeCard?.querySelectorAll('.rate-btn');
        this.elements.nextJokeBtn = this.elements.jokeCard?.querySelector('.next-joke-btn');
        this.elements.shareBtn = this.elements.jokeCard?.querySelector('.share-btn');
        
        // Search view
        this.elements.searchInput = document.getElementById('search-input');
        this.elements.searchBtn = document.getElementById('search-btn');
        this.elements.searchResults = document.getElementById('search-results');
        
        // Submit view
        this.elements.submitForm = document.getElementById('joke-submit-form');
        this.elements.submitStatus = document.getElementById('submit-status');
        
        // Loading overlay
        this.elements.loadingOverlay = document.getElementById('loading-overlay');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation events
        this.elements.navBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Category filter events
        this.elements.categoryBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryChange(e));
        });

        // Joke interaction events
        this.elements.revealBtn?.addEventListener('click', () => this.revealPunchline());
        this.elements.nextJokeBtn?.addEventListener('click', () => this.loadRandomJoke());
        this.elements.shareBtn?.addEventListener('click', () => this.shareJoke());

        // Rating events
        this.elements.rateBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => this.rateJoke(e));
        });

        // Search events
        this.elements.searchBtn?.addEventListener('click', () => this.performSearch());
        this.elements.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Submit form events
        this.elements.submitForm?.addEventListener('submit', (e) => this.handleSubmitJoke(e));
    }

    /**
     * Handle navigation between views
     */
    handleNavigation(event) {
        const targetView = event.target.dataset.view;
        if (!targetView) return;

        // Update nav buttons
        this.elements.navBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Update views
        this.elements.views.forEach(view => view.classList.remove('active'));
        document.getElementById(`${targetView}-view`)?.classList.add('active');

        this.currentView = targetView;

        // Load view-specific data
        if (targetView === 'browse' && !this.currentJoke) {
            this.loadRandomJoke();
        }
    }

    /**
     * Handle category filter changes
     */
    async handleCategoryChange(event) {
        const category = event.target.dataset.category;
        if (!category || category === this.currentCategory) return;

        // Update category buttons
        this.elements.categoryBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        this.currentCategory = category;

        // Load joke from selected category
        if (category === 'all') {
            await this.loadRandomJoke();
        } else {
            await this.loadCategoryJoke(category);
        }
    }

    /**
     * Load categories from API
     */
    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            
            if (data.success) {
                console.log('Loaded categories:', data.categories);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    /**
     * Load a random joke
     */
    async loadRandomJoke() {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true);
            
            const response = await fetch('/api/jokes/random');
            const data = await response.json();
            
            if (data.success && data.joke) {
                this.displayJoke(data.joke);
            } else {
                this.showError('Failed to load joke. Please try again.');
            }
        } catch (error) {
            console.error('Failed to load random joke:', error);
            this.showError('Failed to load joke. Please check your connection.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Load a joke from a specific category
     */
    async loadCategoryJoke(categorySlug) {
        if (this.isLoading) return;
        
        try {
            this.setLoading(true);
            
            const response = await fetch(`/api/jokes/category/${categorySlug}`);
            const data = await response.json();
            
            if (data.success && data.joke) {
                this.displayJoke(data.joke);
            } else {
                this.showError(`No jokes found in this category. Please try another category.`);
            }
        } catch (error) {
            console.error('Failed to load category joke:', error);
            this.showError('Failed to load joke. Please check your connection.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Display a joke in the UI
     */
    displayJoke(joke) {
        this.currentJoke = joke;
        
        // Reset display state
        this.elements.jokePunchline.style.display = 'none';
        this.elements.jokeReveal.style.display = joke.punchline ? 'block' : 'none';
        
        // Display joke content
        this.elements.jokeSetup.textContent = joke.setup;
        this.elements.jokePunchline.textContent = joke.punchline || '';
        
        // Display category
        this.elements.categoryTag.textContent = this.formatCategoryName(joke.category_slug);
        
        // Display rating
        const rating = joke.average_rating || 0;
        const ratingCount = joke.rating_count || 0;
        this.elements.ratingValue.textContent = rating.toFixed(1);
        this.elements.ratingCount.textContent = `(${ratingCount} vote${ratingCount !== 1 ? 's' : ''})`;
        
        // Reset rate buttons
        this.elements.rateBtns.forEach(btn => btn.classList.remove('selected'));
        
        console.log('Displayed joke:', joke.id);
    }

    /**
     * Reveal the punchline
     */
    revealPunchline() {
        if (!this.currentJoke?.punchline) return;
        
        this.elements.jokePunchline.style.display = 'block';
        this.elements.jokeReveal.style.display = 'none';
    }

    /**
     * Rate a joke
     */
    async rateJoke(event) {
        if (!this.currentJoke) return;
        
        const rating = parseInt(event.target.dataset.rating);
        if (!rating || rating < 1 || rating > 5) return;
        
        try {
            const response = await fetch(`/api/jokes/${this.currentJoke.id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update rating display
                this.elements.ratingValue.textContent = data.averageRating.toFixed(1);
                this.elements.ratingCount.textContent = `(${data.ratingCount} vote${data.ratingCount !== 1 ? 's' : ''})`;
                
                // Highlight selected rating
                this.elements.rateBtns.forEach((btn, index) => {
                    btn.classList.toggle('selected', index < rating);
                });
                
                this.showSuccess('Thanks for rating! 🌟');
            } else {
                this.showError('Failed to submit rating. Please try again.');
            }
        } catch (error) {
            console.error('Failed to rate joke:', error);
            this.showError('Failed to submit rating. Please check your connection.');
        }
    }

    /**
     * Share current joke
     */
    async shareJoke() {
        if (!this.currentJoke) return;
        
        const shareText = `${this.currentJoke.setup}${this.currentJoke.punchline ? '\n\n' + this.currentJoke.punchline : ''}\n\nFrom FamilyJokes - Family-friendly humor for everyone!`;
        const shareUrl = window.location.href;
        
        try {
            if (navigator.share) {
                // Use native share API if available
                await navigator.share({
                    title: 'FamilyJokes - Great Joke!',
                    text: shareText,
                    url: shareUrl
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareText);
                this.showSuccess('Joke copied to clipboard! 📋');
            }
        } catch (error) {
            console.error('Failed to share joke:', error);
            // Final fallback - show text in alert
            alert(`Share this joke:\n\n${shareText}`);
        }
    }

    /**
     * Perform search
     */
    async performSearch() {
        const query = this.elements.searchInput?.value.trim();
        if (!query) return;
        
        try {
            this.setLoading(true);
            
            const response = await fetch(`/api/jokes/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.displaySearchResults(data.jokes, query);
            } else {
                this.showSearchError('Search failed. Please try again.');
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.showSearchError('Search failed. Please check your connection.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Display search results
     */
    displaySearchResults(jokes, query) {
        const resultsContainer = this.elements.searchResults;
        if (!resultsContainer) return;
        
        if (jokes.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-status">
                    <p>No jokes found for "<strong>${this.escapeHtml(query)}</strong>"</p>
                    <p>Try different keywords or browse by category!</p>
                </div>
            `;
            return;
        }
        
        const resultsHtml = `
            <div class="search-status">
                <p>Found ${jokes.length} joke${jokes.length !== 1 ? 's' : ''} for "<strong>${this.escapeHtml(query)}</strong>"</p>
            </div>
            ${jokes.map(joke => this.createSearchResultHtml(joke)).join('')}
        `;
        
        resultsContainer.innerHTML = resultsHtml;
        
        // Add event listeners for search result interactions
        this.bindSearchResultEvents();
    }

    /**
     * Create HTML for a search result
     */
    createSearchResultHtml(joke) {
        const category = this.formatCategoryName(joke.category_slug);
        const rating = joke.average_rating || 0;
        const ratingCount = joke.rating_count || 0;
        
        return `
            <div class="search-result" data-joke-id="${joke.id}">
                <div class="joke-content">
                    <p class="joke-setup">${this.escapeHtml(joke.setup)}</p>
                    ${joke.punchline ? `<p class="joke-punchline">${this.escapeHtml(joke.punchline)}</p>` : ''}
                </div>
                <div class="result-meta">
                    <span class="category-tag">${category}</span>
                    <span class="rating-display">⭐ ${rating.toFixed(1)} (${ratingCount} vote${ratingCount !== 1 ? 's' : ''})</span>
                </div>
                <button class="action-btn use-joke-btn" data-joke-id="${joke.id}">Use This Joke</button>
            </div>
        `;
    }

    /**
     * Bind events for search results
     */
    bindSearchResultEvents() {
        const useJokeBtns = this.elements.searchResults?.querySelectorAll('.use-joke-btn');
        useJokeBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jokeId = e.target.dataset.jokeId;
                this.useSearchResultJoke(jokeId);
            });
        });
    }

    /**
     * Use a joke from search results
     */
    async useSearchResultJoke(jokeId) {
        try {
            // Find the joke in current search results
            const jokeResult = this.elements.searchResults?.querySelector(`[data-joke-id="${jokeId}"]`);
            if (!jokeResult) return;
            
            // Extract joke data (this is a simplified approach)
            const setup = jokeResult.querySelector('.joke-setup')?.textContent;
            const punchline = jokeResult.querySelector('.joke-punchline')?.textContent;
            
            if (setup) {
                // Create a temporary joke object
                const joke = {
                    id: jokeId,
                    setup: setup,
                    punchline: punchline || '',
                    category_slug: 'search', // placeholder
                    average_rating: 0,
                    rating_count: 0
                };
                
                // Switch to browse view and display the joke
                this.switchToBrowseView();
                this.displayJoke(joke);
            }
        } catch (error) {
            console.error('Failed to use search result joke:', error);
        }
    }

    /**
     * Handle joke submission
     */
    async handleSubmitJoke(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const jokeData = {
            category: formData.get('category'),
            setup: formData.get('setup'),
            punchline: formData.get('punchline') || '',
            submitter_name: formData.get('submitter_name') || ''
        };
        
        // Validate required fields
        if (!jokeData.category || !jokeData.setup) {
            this.showSubmitError('Please fill in all required fields.');
            return;
        }
        
        try {
            this.setLoading(true);
            
            const response = await fetch('/api/jokes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jokeData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSubmitSuccess('Thank you! Your joke has been received and will be reviewed before being published.');
                event.target.reset(); // Clear form
            } else {
                this.showSubmitError(data.message || 'Failed to submit joke. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit joke:', error);
            this.showSubmitError('Failed to submit joke. Please check your connection.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Utility methods
     */
    
    switchToBrowseView() {
        // Update navigation
        this.elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === 'browse');
        });
        
        // Update views
        this.elements.views.forEach(view => {
            view.classList.toggle('active', view.id === 'browse-view'); 
        });
        
        this.currentView = 'browse';
    }
    
    formatCategoryName(slug) {
        const categoryNames = {
            'dad-jokes': 'Dad Jokes',
            'one-liners': 'One-Liners',
            'knock-knock': 'Knock-Knock',
            'riddles': 'Riddles',
            'animal-jokes': 'Animal Jokes',
            'tech-jokes': 'Tech Jokes'
        };
        return categoryNames[slug] || slug;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = loading ? 'flex' : 'none';
        }
    }
    
    showError(message) {
        console.error(message);
        // You could implement a toast/notification system here
        alert(`Error: ${message}`);
    }
    
    showSuccess(message) {
        console.log(message);
        // You could implement a toast/notification system here
        
        // Quick visual feedback
        const originalText = this.elements.nextJokeBtn?.textContent;
        if (this.elements.nextJokeBtn && originalText) {
            this.elements.nextJokeBtn.textContent = message;
            setTimeout(() => {
                this.elements.nextJokeBtn.textContent = originalText;
            }, 2000);
        }
    }
    
    showSearchError(message) {
        if (this.elements.searchResults) {
            this.elements.searchResults.innerHTML = `
                <div class="search-status">
                    <p style="color: #dc2626;">${this.escapeHtml(message)}</p>
                </div>
            `;
        }
    }
    
    showSubmitSuccess(message) {
        if (this.elements.submitStatus) {
            this.elements.submitStatus.className = 'submit-status success';
            this.elements.submitStatus.textContent = message;
            this.elements.submitStatus.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                this.elements.submitStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    showSubmitError(message) {
        if (this.elements.submitStatus) {
            this.elements.submitStatus.className = 'submit-status error';
            this.elements.submitStatus.textContent = message;
            this.elements.submitStatus.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                this.elements.submitStatus.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the application
const familyJokesApp = new FamilyJokesApp();

// Make it globally accessible for debugging
window.familyJokesApp = familyJokesApp;