/**
 * Database Seeding Script for FamilyJokes
 * Seeds the database with family-friendly jokes across all categories
 */

const Database = require('../models/Database');
const Joke = require('../models/Joke');
const Category = require('../models/Category');

class DatabaseSeeder {
    constructor() {
        this.database = null;
        this.jokeModel = null;
        this.categoryModel = null;
    }

    async init() {
        this.database = new Database();
        await this.database.init();
        
        this.jokeModel = new Joke(this.database);
        this.categoryModel = new Category(this.database);
    }

    /**
     * Run the complete seeding process
     */
    async seed() {
        try {
            console.log('🌱 Starting database seeding...');
            
            await this.init();
            
            // Clear existing data for fresh seed
            await this.clearExistingData();
            
            // Seed categories
            await this.seedCategories();
            
            // Seed jokes
            await this.seedJokes();
            
            console.log('✅ Database seeding completed successfully!');
            
        } catch (error) {
            console.error('❌ Database seeding failed:', error);
            throw error;
        } finally {
            if (this.database) {
                this.database.close();
            }
        }
    }

    async clearExistingData() {
        console.log('🧹 Clearing existing data...');
        
        const queries = [
            'DELETE FROM jokes',
            'DELETE FROM categories',
            'DELETE FROM moderation_queue',
            'DELETE FROM filter_rules'
        ];

        for (const query of queries) {
            await this.database.run(query);
        }
        
        console.log('   ✓ Existing data cleared');
    }

    async seedCategories() {
        console.log('📂 Seeding categories...');
        
        const categories = [
            {
                name: 'Dad Jokes',
                slug: 'dad-jokes',
                description: 'Classic groan-worthy puns and wholesome humor that dads everywhere love to share'
            },
            {
                name: 'One-Liners',
                slug: 'one-liners',
                description: 'Quick, witty jokes that pack a punch in just one sentence'
            },
            {
                name: 'Knock-Knock Jokes',
                slug: 'knock-knock',
                description: 'Interactive classics that never go out of style'
            },
            {
                name: 'Riddles',
                slug: 'riddles',
                description: 'Brain teasers and clever wordplay that make you think and laugh'
            },
            {
                name: 'Animal Jokes',
                slug: 'animal-jokes',
                description: 'Funny stories and puns featuring our favorite furry, feathered, and finned friends'
            },
            {
                name: 'Tech Jokes',
                slug: 'tech-jokes',
                description: 'Programming, computer, and technology humor for the digital age'
            }
        ];

        for (const category of categories) {
            const result = await this.database.run(
                'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
                [category.name, category.slug, category.description]
            );
            console.log(`   ✓ Added category: ${category.name}`);
        }
    }

    async seedJokes() {
        console.log('😂 Seeding jokes...');
        
        const jokes = [
            // Dad Jokes
            {
                category: 'dad-jokes',
                setup: "I'm reading a book about anti-gravity.",
                punchline: "It's impossible to put down!"
            },
            {
                category: 'dad-jokes',
                setup: "Why don't scientists trust atoms?",
                punchline: "Because they make up everything!"
            },
            {
                category: 'dad-jokes',
                setup: "Did you hear about the mathematician who's afraid of negative numbers?",
                punchline: "He'll stop at nothing to avoid them!"
            },
            {
                category: 'dad-jokes',
                setup: "How do you organize a space party?",
                punchline: "You planet!"
            },
            {
                category: 'dad-jokes',
                setup: "Why did the scarecrow win an award?",
                punchline: "He was outstanding in his field!"
            },
            {
                category: 'dad-jokes',
                setup: "What do you call a fake noodle?",
                punchline: "An impasta!"
            },
            {
                category: 'dad-jokes',
                setup: "How does a penguin build its house?",
                punchline: "Igloos it together!"
            },
            {
                category: 'dad-jokes',
                setup: "Why don't eggs tell jokes?",
                punchline: "They'd crack each other up!"
            },

            // One-Liners
            {
                category: 'one-liners',
                setup: "I told my wife she was drawing her eyebrows too high.",
                punchline: "She looked surprised."
            },
            {
                category: 'one-liners',
                setup: "I haven't slept for ten days.",
                punchline: "Because that would be too long."
            },
            {
                category: 'one-liners',
                setup: "I used to hate facial hair...",
                punchline: "But then it grew on me."
            },
            {
                category: 'one-liners',
                setup: "The early bird might get the worm...",
                punchline: "But the second mouse gets the cheese."
            },
            {
                category: 'one-liners',
                setup: "I'm on a seafood diet.",
                punchline: "I see food and I eat it."
            },
            {
                category: 'one-liners',
                setup: "Time flies like an arrow.",
                punchline: "Fruit flies like a banana."
            },
            {
                category: 'one-liners',
                setup: "I wondered why the baseball kept getting bigger.",
                punchline: "Then it hit me."
            },
            {
                category: 'one-liners',
                setup: "A jumper cable walks into a bar.",
                punchline: "The bartender says, 'I'll serve you, but don't start anything.'"
            },

            // Knock-Knock Jokes
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Lettuce. Lettuce who?",
                punchline: "Lettuce in, it's cold out here!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Orange. Orange who?",
                punchline: "Orange you glad I didn't say banana?"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Interrupting cow. Interrupting cow w-",
                punchline: "MOO!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Boo. Boo who?",
                punchline: "Don't cry, it's just a joke!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Dishes. Dishes who?",
                punchline: "Dishes a very bad joke!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Tank. Tank who?",
                punchline: "You're welcome!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Cargo. Cargo who?",
                punchline: "Car go beep beep, vroom vroom!"
            },
            {
                category: 'knock-knock',
                setup: "Knock knock! Who's there? Cash. Cash who?",
                punchline: "No thanks, I prefer peanuts!"
            },

            // Riddles
            {
                category: 'riddles',
                setup: "What has keys but no locks, space but no room, and you can enter but not go inside?",
                punchline: "A keyboard!"
            },
            {
                category: 'riddles',
                setup: "What gets wetter the more it dries?",
                punchline: "A towel!"
            },
            {
                category: 'riddles',
                setup: "What has hands but can't clap?",
                punchline: "A clock!"
            },
            {
                category: 'riddles',
                setup: "What can travel around the world while staying in a corner?",
                punchline: "A stamp!"
            },
            {
                category: 'riddles',
                setup: "What has a head and a tail but no body?",
                punchline: "A coin!"
            },
            {
                category: 'riddles',
                setup: "What goes up but never comes down?",
                punchline: "Your age!"
            },
            {
                category: 'riddles',
                setup: "What has one eye but can't see?",
                punchline: "A needle!"
            },
            {
                category: 'riddles',
                setup: "What can you catch but not throw?",
                punchline: "A cold!"
            },

            // Animal Jokes
            {
                category: 'animal-jokes',
                setup: "Why don't elephants use computers?",
                punchline: "They're afraid of the mouse!"
            },
            {
                category: 'animal-jokes',
                setup: "What do you call a sleeping bull?",
                punchline: "A bulldozer!"
            },
            {
                category: 'animal-jokes',
                setup: "Why do fish live in saltwater?",
                punchline: "Because pepper makes them sneeze!"
            },
            {
                category: 'animal-jokes',
                setup: "What do you call a bear with no teeth?",
                punchline: "A gummy bear!"
            },
            {
                category: 'animal-jokes',
                setup: "Why do cows wear bells?",
                punchline: "Because their horns don't work!"
            },
            {
                category: 'animal-jokes',
                setup: "What do you call a pig that does karate?",
                punchline: "A pork chop!"
            },
            {
                category: 'animal-jokes',
                setup: "Why don't oysters share?",
                punchline: "Because they're shellfish!"
            },
            {
                category: 'animal-jokes',
                setup: "What do you call a dinosaur that crashes his car?",
                punchline: "Tyrannosaurus Wrecks!"
            },

            // Tech Jokes
            {
                category: 'tech-jokes',
                setup: "Why do programmers prefer dark mode?",
                punchline: "Because light attracts bugs!"
            },
            {
                category: 'tech-jokes',
                setup: "How many programmers does it take to change a light bulb?",
                punchline: "None. That's a hardware problem."
            },
            {
                category: 'tech-jokes',
                setup: "Why did the programmer quit his job?",
                punchline: "He didn't get arrays!"
            },
            {
                category: 'tech-jokes',
                setup: "What's the object-oriented way to become wealthy?",
                punchline: "Inheritance!"
            },
            {
                category: 'tech-jokes',
                setup: "Why do Java developers wear glasses?",
                punchline: "Because they can't C#!"
            },
            {
                category: 'tech-jokes',
                setup: "How do you comfort a JavaScript bug?",
                punchline: "You console it!"
            },
            {
                category: 'tech-jokes',
                setup: "Why was the JavaScript developer sad?",
                punchline: "Because he didn't Node how to Express himself!"
            },
            {
                category: 'tech-jokes',
                setup: "There are only 10 types of people in the world:",
                punchline: "Those who understand binary and those who don't!"
            }
        ];

        // Get category IDs
        const categories = await this.database.all('SELECT * FROM categories');
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.slug] = cat.id;
        });

        let jokeCount = 0;
        for (const jokeData of jokes) {
            const categoryId = categoryMap[jokeData.category];
            if (!categoryId) {
                console.warn(`   ⚠️  Category not found: ${jokeData.category}`);
                continue;
            }

            const result = await this.database.run(
                `INSERT INTO jokes (category_id, setup, punchline, status, created_at, updated_at) 
                 VALUES (?, ?, ?, 'approved', datetime('now'), datetime('now'))`,
                [categoryId, jokeData.setup, jokeData.punchline]
            );

            jokeCount++;
        }

        console.log(`   ✅ Added ${jokeCount} jokes across ${Object.keys(categoryMap).length} categories`);
        
        // Add some sample ratings to make the data more realistic
        await this.seedSampleRatings();
    }

    async seedSampleRatings() {
        console.log('⭐ Adding sample ratings...');
        
        const jokes = await this.database.all('SELECT id FROM jokes LIMIT 20');
        let updateCount = 0;
        
        for (const joke of jokes) {
            // Generate random rating counts (3-8 positive, 0-2 negative)
            const positiveRatings = Math.floor(Math.random() * 6) + 3; // 3-8 positive
            const negativeRatings = Math.floor(Math.random() * 3); // 0-2 negative
            const totalRatings = positiveRatings + negativeRatings;
            
            await this.database.run(
                'UPDATE jokes SET rating_count = ?, positive_ratings = ?, negative_ratings = ? WHERE id = ?',
                [totalRatings, positiveRatings, negativeRatings, joke.id]
            );
            
            updateCount++;
        }
        
        console.log(`   ✅ Updated ${updateCount} jokes with sample ratings`);
    }
}

// Seeding script execution
if (require.main === module) {
    const seeder = new DatabaseSeeder();
    
    seeder.seed()
        .then(() => {
            console.log('🎉 Database seeding completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Database seeding failed:', error);
            process.exit(1);
        });
}

module.exports = DatabaseSeeder;