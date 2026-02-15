class ContentFilter {
    constructor(database) {
        this.db = database;
        this.forbiddenWords = new Set();
        this.inappropriatePatterns = [
            /\b(alcohol|beer|wine|drunk|drinking)\b/i,
            /\b(drugs|marijuana|cocaine|smoking|cigarette)\b/i,
            /\b(violence|kill|murder|fight|punch|hit|weapon)\b/i,
            /\b(sex|sexual|intimate|adult|mature)\b/i,
            /\b(hell|damn|crap)\b/i, // Mild profanity - borderline for PG-13
            /\b(stupid|idiot|moron|dumb)\b/i // Potentially hurtful language
        ];
        this.loadFilterRules();
    }

    async loadFilterRules() {
        try {
            const rules = await this.db.all(
                'SELECT * FROM filter_rules WHERE is_active = 1'
            );
            
            rules.forEach(rule => {
                if (rule.rule_type === 'forbidden_word') {
                    this.forbiddenWords.add(rule.rule_value.toLowerCase());
                }
            });
            
            console.log(`Loaded ${this.forbiddenWords.size} content filter rules`);
        } catch (error) {
            console.warn('Could not load filter rules, using defaults');
        }
    }

    validateSubmission(req, res, next) {
        const { setup, punchline } = req.body;
        
        if (!setup || setup.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Joke setup is required'
            });
        }

        const content = `${setup} ${punchline || ''}`.toLowerCase();

        // Check forbidden words
        for (const word of this.forbiddenWords) {
            if (content.includes(word)) {
                return res.status(400).json({
                    success: false,
                    message: 'Content contains inappropriate language for family-friendly site'
                });
            }
        }

        // Additional PG-13 validation rules
        if (this.containsInappropriateContent(content)) {
            return res.status(400).json({
                success: false,
                message: 'Content not suitable for PG-13 audience'
            });
        }

        // Check for minimum quality standards
        if (!this.meetsQualityStandards(setup, punchline)) {
            return res.status(400).json({
                success: false,
                message: 'Content does not meet quality standards for jokes'
            });
        }

        next();
    }

    containsInappropriateContent(content) {
        return this.inappropriatePatterns.some(pattern => pattern.test(content));
    }

    meetsQualityStandards(setup, punchline) {
        // Basic quality checks
        if (setup.length < 10) {
            return false; // Too short
        }
        
        if (setup.length > 500) {
            return false; // Too long
        }
        
        if (punchline && punchline.length > 200) {
            return false; // Punchline too long
        }
        
        // Check for excessive repetition
        const words = setup.toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);
        if (uniqueWords.size < words.length * 0.5) {
            return false; // Too repetitive
        }
        
        return true;
    }

    async addFilterRule(ruleType, ruleValue, severity = 'moderate') {
        const query = `
            INSERT INTO filter_rules (rule_type, rule_value, severity)
            VALUES (?, ?, ?)
        `;
        await this.db.run(query, [ruleType, ruleValue, severity]);
        await this.loadFilterRules(); // Reload rules
    }
}

module.exports = ContentFilter;