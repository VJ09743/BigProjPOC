class Category {
    constructor(database) {
        this.db = database;
    }

    async getAllCategories() {
        const query = `
            SELECT c.*, 
                   COUNT(j.id) as joke_count
            FROM categories c
            LEFT JOIN jokes j ON c.id = j.category_id AND j.status = 'approved'
            GROUP BY c.id
            ORDER BY c.name ASC
        `;
        return await this.db.all(query);
    }

    async getCategoryBySlug(slug) {
        const query = `
            SELECT c.*, 
                   COUNT(j.id) as joke_count
            FROM categories c
            LEFT JOIN jokes j ON c.id = j.category_id AND j.status = 'approved'
            WHERE c.slug = ?
            GROUP BY c.id
        `;
        return await this.db.get(query, [slug]);
    }

    async getCategoryById(id) {
        const query = `
            SELECT c.*, 
                   COUNT(j.id) as joke_count
            FROM categories c
            LEFT JOIN jokes j ON c.id = j.category_id AND j.status = 'approved'  
            WHERE c.id = ?
            GROUP BY c.id
        `;
        return await this.db.get(query, [id]);
    }

    async createCategory(name, description, slug) {
        const query = `
            INSERT INTO categories (name, description, slug)
            VALUES (?, ?, ?)
        `;
        const result = await this.db.run(query, [name, description, slug]);
        return await this.getCategoryById(result.id);
    }
}

module.exports = Category;