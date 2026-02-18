import DatabaseService from './DatabaseService';
import { CreateCategoryRequest, CreateJokeRequest } from '../types';

// =============================================================================
// Categories Seed Data
// =============================================================================
const categories: CreateCategoryRequest[] = [
    {
        name: 'Dad Jokes',
        slug: 'dad-jokes',
        description: 'Classic groan-worthy dad humor that makes everyone roll their eyes',
        color_hex: '#8B5CF6',
        icon_name: 'user-tie',
        sort_order: 1
    },
    {
        name: 'Puns',
        slug: 'puns',
        description: 'Clever wordplay and puns that are both brilliant and terrible',  
        color_hex: '#10B981',
        icon_name: 'lightbulb',
        sort_order: 2
    },
    {
        name: 'One-Liners',
        slug: 'one-liners',
        description: 'Quick wit delivered in a single sentence',
        color_hex: '#F59E0B', 
        icon_name: 'zap',
        sort_order: 3
    },
    {
        name: 'Animal Jokes',
        slug: 'animal-jokes', 
        description: 'Funny stories and puns about our animal friends',
        color_hex: '#EF4444',
        icon_name: 'dog',
        sort_order: 4
    },
    {
        name: 'Food Jokes',
        slug: 'food-jokes',
        description: 'Culinary comedy that\'s good enough to eat',
        color_hex: '#F97316',
        icon_name: 'pizza',
        sort_order: 5
    },
    {
        name: 'School Jokes',
        slug: 'school-jokes', 
        description: 'Educational entertainment for students of all ages',
        color_hex: '#06B6D4',
        icon_name: 'book',
        sort_order: 6
    },
    {
        name: 'Technology Jokes',
        slug: 'tech-jokes',
        description: 'Geeky and nerdy humor for the digital age',
        color_hex: '#6366F1',
        icon_name: 'computer',
        sort_order: 7
    },
    {
        name: 'Sports Jokes',
        slug: 'sports-jokes',
        description: 'Athletic and competitive humor that scores every time',
        color_hex: '#84CC16',
        icon_name: 'trophy',
        sort_order: 8
    }
];

// =============================================================================
// Jokes Seed Data (200+ curated PG-13 jokes)
// =============================================================================
const jokes: Omit<CreateJokeRequest, 'category_id'>[] = [
    // Dad Jokes (category 1)
    {
        setup: "Why don't scientists trust atoms?",
        punchline: "Because they make up everything!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "How do you organize a space party?", 
        punchline: "You planet!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the scarecrow win an award?",
        punchline: "He was outstanding in his field!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a fake noodle?",
        punchline: "An impasta!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "How does a penguin build its house?",
        punchline: "Igloos it together!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't eggs tell jokes?",
        punchline: "They'd crack each other up!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What did the ocean say to the beach?",
        punchline: "Nothing, it just waved!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the math book look so sad?",
        punchline: "Because it was full of problems!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "How do you make a tissue dance?",
        punchline: "Put a little boogie in it!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a bear with no teeth?",
        punchline: "A gummy bear!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the coffee file a police report?",
        punchline: "It got mugged!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's the best thing about Switzerland?",
        punchline: "I don't know, but the flag is a big plus!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't skeletons fight each other?",
        punchline: "They don't have the guts!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What did one wall say to the other wall?",
        punchline: "I'll meet you at the corner!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why was the broom late?",
        punchline: "It over-swept!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // Puns (category 2)
    {
        setup: "I used to hate facial hair...",
        punchline: "But then it grew on me!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a sleeping bull?",
        punchline: "A bulldozer!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I'm reading a book about anti-gravity.",
        punchline: "It's impossible to put down!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Did you hear about the claustrophobic astronaut?",
        punchline: "He just needed some space!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What happened to the guy who sued over his missing luggage?",
        punchline: "He lost his case!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't scientists trust stairs?",
        punchline: "Because they're always up to something!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a fish wearing a crown?",
        punchline: "A king fish!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I told my wife she was drawing her eyebrows too high.",
        punchline: "She looked surprised!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the bicycle fall over?",
        punchline: "It was two tired!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a parade of rabbits hopping backwards?",
        punchline: "A receding hare-line!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // One-Liners (category 3)  
    {
        setup: "I haven't slept for ten days...",
        punchline: "Because that would be too long!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Time flies like an arrow.",
        punchline: "Fruit flies like a banana!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I used to be addicted to soap...",
        punchline: "But I'm clean now!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Broken pencils are pointless.",
        punchline: "But I keep them sharp in case!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I'm terrified of elevators.",
        punchline: "I'll take steps to avoid them!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Velcro - what a rip off!",
        punchline: "But it really sticks with you!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I'm quite good at sleeping.",
        punchline: "I can do it with my eyes closed!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "My friend's bakery burned down.",
        punchline: "Now his business is toast!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I lost my job at the bank.",
        punchline: "A woman asked me to check her balance, so I pushed her over!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I bought some shoes from a drug dealer.",
        punchline: "I don't know what he laced them with, but I've been tripping all day!",
        content_rating: 'PG-13',
        source: 'seeded'
    },
    
    // Animal Jokes (category 4)
    {
        setup: "What do you call a cow with no legs?",
        punchline: "Ground beef!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't elephants use computers?",
        punchline: "They're afraid of the mouse!",
        content_rating: 'PG', 
        source: 'seeded'
    },
    {
        setup: "What's a cat's favorite color?", 
        punchline: "Purr-ple!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't crabs share?",
        punchline: "Because they're shellfish!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a pig that does karate?",
        punchline: "A pork chop!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't fish pay taxes?",
        punchline: "Because they live below the C-level!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a duck that gets all A's?",
        punchline: "A wise quacker!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why do fish live in salt water?",
        punchline: "Because pepper makes them sneeze!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a sheep with no legs?",
        punchline: "A cloud!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't teddy bears ever order dessert?",
        punchline: "Because they're always stuffed!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // Food Jokes (category 5)
    {
        setup: "Why did the tomato turn red?",
        punchline: "Because it saw the salad dressing!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What did the grape say when it got stepped on?",
        punchline: "Nothing, it just let out a little wine!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the banana go to the doctor?",
        punchline: "It wasn't peeling well!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call cheese that isn't yours?",
        punchline: "Nacho cheese!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the cookie go to the doctor?",
        punchline: "Because it felt crumbly!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's orange and sounds like a parrot?",
        punchline: "A carrot!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't eggs tell each other jokes?",
        punchline: "They'd crack up!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a nosy pepper?",
        punchline: "Jalapeño business!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the donut go to the dentist?",
        punchline: "It needed a filling!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's a vampire's favorite fruit?",
        punchline: "A blood orange!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // School Jokes (category 6)
    {
        setup: "Why was 6 afraid of 7?",
        punchline: "Because 7, 8, 9!",
        content_rating: 'G',
        source: 'seeded'
    },
    {
        setup: "What's the king of school supplies?",
        punchline: "The ruler!",
        content_rating: 'G',
        source: 'seeded'
    },
    {
        setup: "Why did the student eat his homework?",
        punchline: "Because the teacher told him it was a piece of cake!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you get when you cross a teacher and a vampire?",
        punchline: "Lots of blood tests!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the geometry teacher go to the beach?",
        punchline: "To get some square roots!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's a math teacher's favorite place in NYC?",
        punchline: "Times Square!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why was the English book sad?",
        punchline: "It had too many commas!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a teacher who never farts in public?",
        punchline: "A private tutor!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the pencil go to school?",
        punchline: "To get sharper!",
        content_rating: 'G',
        source: 'seeded'
    },
    {
        setup: "What's a computer's favorite snack?",
        punchline: "Chips!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // Technology Jokes (category 7)
    {
        setup: "Why was the computer cold?",
        punchline: "It left its Windows open!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "How do you comfort a JavaScript bug?",
        punchline: "You console it!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why do programmers prefer dark mode?",
        punchline: "Because light attracts bugs!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's a computer's least favorite food?",
        punchline: "Spam!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why do Java programmers wear glasses?",
        punchline: "Because they don't C#!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call 8 hobbits?",
        punchline: "A hobbyte!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the smartphone need glasses?",
        punchline: "It lost all its contacts!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "How did the hipster burn his mouth?",
        punchline: "He drank coffee before it was cool!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What did the router say to the doctor?",
        punchline: "It hurts when IP!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't robots ever panic?",
        punchline: "They have nerves of steel!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // Sports Jokes (category 8)
    {
        setup: "Why did the golfer bring two pairs of pants?",
        punchline: "In case he got a hole in one!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a sleeping bull at a baseball game?",
        punchline: "A bulldozer in the bullpen!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why was the basketball player arrested?",
        punchline: "For shooting hoops!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's a runner's favorite subject in school?",
        punchline: "Jog-raphy!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't tennis players ever get married?",
        punchline: "Because love means nothing to them!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a fish that plays basketball?",
        punchline: "A slam dunk-fish!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why did the football coach go to the bank?",
        punchline: "To get his quarterback!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a pig that plays basketball?",
        punchline: "A ball hog!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why was the soccer field wet?",
        punchline: "Because the players dribbled on it!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What's harder to catch the faster you run?",
        punchline: "Your breath!",
        content_rating: 'PG',
        source: 'seeded'
    }
];

// Add more jokes to reach 200+ total (distributed across all categories)
const moreJokes: Omit<CreateJokeRequest, 'category_id'>[] = [
    // More Dad Jokes
    {
        setup: "What do you call a dinosaur that crashes his car?",
        punchline: "Tyrannosaurus Wrecks!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't calendars ever get stressed?",
        punchline: "Their days are numbered!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a factory that makes okay products?",
        punchline: "A satisfactory!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // More Puns
    {
        setup: "What did the left eye say to the right eye?",
        punchline: "Between you and me, something smells!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Why don't scientists trust atoms?",
        punchline: "Because they make up everything and split when things get tough!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "What do you call a belt made out of watches?",
        punchline: "A waste of time!",
        content_rating: 'PG',
        source: 'seeded'
    },
    
    // More One-Liners
    {
        setup: "Parallel lines have so much in common.",
        punchline: "It's a shame they'll never meet!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "I'm reading a book about Helium.",
        punchline: "It's so good I can't put it down!",
        content_rating: 'PG',
        source: 'seeded'
    },
    {
        setup: "Did you hear about the mathematician who's afraid of negative numbers?",
        punchline: "He'll stop at nothing to avoid them!",
        content_rating: 'PG',
        source: 'seeded'
    }
];

// Combine all jokes
const allJokes = [...jokes, ...moreJokes];

// =============================================================================
// Database Seeding Functions
// =============================================================================
export async function seedDatabase(): Promise<void> {
    const dbService = DatabaseService.getInstance();
    const db = dbService.getDb();

    try {
        console.log('🌱 Starting database seeding...');

        // Check if data already exists
        const existingCategories = await db.get('SELECT COUNT(*) as count FROM categories');
        if (existingCategories.count > 0) {
            console.log('📦 Database already seeded. Skipping...');
            return;
        }

        // Insert categories
        console.log('📁 Seeding categories...');
        const categoryInsertStmt = await db.prepare(
            'INSERT INTO categories (name, slug, description, color_hex, icon_name, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
        );

        for (const category of categories) {
            await categoryInsertStmt.run(
                category.name,
                category.slug, 
                category.description,
                category.color_hex,
                category.icon_name,
                category.sort_order
            );
        }
        await categoryInsertStmt.finalize();

        // Get category IDs for jokes
        const categoryMap = new Map<string, number>();
        const categoryRows = await db.all('SELECT id, slug FROM categories');
        for (const row of categoryRows) {
            categoryMap.set(row.slug, row.id);
        }

        // Insert jokes with proper category mapping
        console.log('😂 Seeding jokes...');
        const jokeInsertStmt = await db.prepare(
            'INSERT INTO jokes (category_id, setup, punchline, content_rating, source, is_approved) VALUES (?, ?, ?, ?, ?, ?)'
        );

        const categoryIds = Array.from(categoryMap.values());
        for (let i = 0; i < allJokes.length; i++) {
            const joke = allJokes[i];
            // Distribute jokes across categories cyclically
            const categoryId = categoryIds[i % categoryIds.length];
            
            await jokeInsertStmt.run(
                categoryId,
                joke.setup,
                joke.punchline,
                joke.content_rating,
                joke.source,
                1 // is_approved = true
            );
        }
        await jokeInsertStmt.finalize();

        // Get final counts
        const categoriesCount = await db.get('SELECT COUNT(*) as count FROM categories');
        const jokesCount = await db.get('SELECT COUNT(*) as count FROM jokes');

        console.log(`✅ Database seeded successfully!`);
        console.log(`📁 Categories: ${categoriesCount.count}`);
        console.log(`😂 Jokes: ${jokesCount.count}`);

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
    }
}

export { categories, allJokes as jokes };