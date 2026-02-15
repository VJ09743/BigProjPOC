class Joke {
    constructor(database) {
        this.db = database;
    }

    async getRandomJoke() {
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id 
            WHERE j.status = 'approved' 
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        const joke = await this.db.get(query);
        return this.formatJoke(joke);
    }

    async getJokesByCategory(categorySlug, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id 
            WHERE c.slug = ? AND j.status = 'approved'
            ORDER BY j.positive_ratings DESC, j.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const jokes = await this.db.all(query, [categorySlug, limit, offset]);
        return jokes.map(joke => this.formatJoke(joke));
    }

    async searchJokes(searchTerm, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        
        // Rebuild FTS index if needed
        await this.db.run('INSERT INTO jokes_fts(jokes_fts) VALUES(\'rebuild\')').catch(() => {});
        
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id
            WHERE j.status = 'approved' AND (
                j.setup LIKE ? OR 
                j.punchline LIKE ? OR
                c.name LIKE ?
            )
            ORDER BY 
                CASE 
                    WHEN j.setup LIKE ? THEN 1
                    WHEN j.punchline LIKE ? THEN 2
                    ELSE 3
                END,
                j.positive_ratings DESC
            LIMIT ? OFFSET ?
        `;
        
        const searchParam = `%${searchTerm}%`;
        const jokes = await this.db.all(query, [
            searchParam, searchParam, searchParam, // WHERE clause
            searchParam, searchParam, // ORDER clause
            limit, offset
        ]);
        
        return jokes.map(joke => this.formatJoke(joke));
    }

    async getJokeById(id) {
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug
            FROM jokes j 
            JOIN categories c ON j.category_id = c.id 
            WHERE j.id = ? AND j.status = 'approved'
        `;
        const joke = await this.db.get(query, [id]);
        return joke ? this.formatJoke(joke) : null;
    }

    async rateJoke(jokeId, isPositive) {
        const updateQuery = isPositive 
            ? 'UPDATE jokes SET positive_ratings = positive_ratings + 1, rating_count = rating_count + 1 WHERE id = ?'
            : 'UPDATE jokes SET negative_ratings = negative_ratings + 1, rating_count = rating_count + 1 WHERE id = ?';
        
        const result = await this.db.run(updateQuery, [jokeId]);
        
        if (result.changes > 0) {
            return await this.getJokeById(jokeId);
        }
        return null;
    }

    async submitJoke(jokeData) {
        const { setup, punchline, category_id, submitted_by = 'anonymous' } = jokeData;
        
        // Insert joke with pending status
        const insertQuery = `
            INSERT INTO jokes (category_id, setup, punchline, status, submitted_by)
            VALUES (?, ?, ?, 'pending', ?)
        `;
        
        const result = await this.db.run(insertQuery, [category_id, setup, punchline, submitted_by]);
        
        // Add to moderation queue
        const queueQuery = `
            INSERT INTO moderation_queue (joke_id)
            VALUES (?)
        `;
        await this.db.run(queueQuery, [result.id]);
        
        return result.id;
    }

    async getModerationQueue() {
        const query = `
            SELECT j.*, c.name as category_name, c.slug as category_slug, 
                   mq.submitted_at, mq.review_notes
            FROM moderation_queue mq
            JOIN jokes j ON mq.joke_id = j.id
            JOIN categories c ON j.category_id = c.id
            WHERE j.status = 'pending'
            ORDER BY mq.submitted_at ASC
        `;
        const jokes = await this.db.all(query);
        return jokes.map(joke => this.formatJoke(joke));
    }

    async moderateJoke(jokeId, action, reviewNotes = '', reviewerId = 'admin') {
        const updateJokeQuery = 'UPDATE jokes SET status = ? WHERE id = ?';
        await this.db.run(updateJokeQuery, [action, jokeId]);
        
        const updateQueueQuery = `
            UPDATE moderation_queue 
            SET action_taken = ?, review_notes = ?, reviewer_id = ? 
            WHERE joke_id = ?
        `;
        await this.db.run(updateQueueQuery, [action, reviewNotes, reviewerId, jokeId]);
        
        return await this.getJokeById(jokeId);
    }

    formatJoke(joke) {
        if (!joke) return null;
        
        return {
            id: joke.id,
            setup: joke.setup,
            punchline: joke.punchline,
            contentType: joke.content_type,
            category: {
                id: joke.category_id,
                name: joke.category_name,
                slug: joke.category_slug
            },
            rating: {
                positive: joke.positive_ratings || 0,
                negative: joke.negative_ratings || 0,
                total: joke.rating_count || 0
            },
            isFeatured: Boolean(joke.is_featured),
            createdAt: joke.created_at,
            submittedBy: joke.submitted_by
        };
    }
}

module.exports = Joke;