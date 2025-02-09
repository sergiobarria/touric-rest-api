import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import slugify from 'slugify';

import { startDates, tours } from 'src/db/schemas';
import toursData from '../data/tours-simple.json';

dotenv.config();

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

if (!DATABASE_URL || !DATABASE_AUTH_TOKEN) {
    console.error('❌ DATABASE_URL or DATABASE_AUTH_TOKEN not found in .env file');
    process.exit(0);
}

const db = drizzle({
    connection: {
        url: DATABASE_URL,
        authToken: DATABASE_AUTH_TOKEN,
    },
});

async function main() {
    console.log('🗑️ CLEANING DB..');
    await db.delete(tours);

    console.log('🌱 SEEDING DB...');

    for (const tour of toursData) {
        const [result] = await db
            .insert(tours)
            .values({
                name: tour.name,
                slug: slugify(tour.name, { lower: true }),
                price: tour.price * 100,
                discountPercent: Math.floor(Math.random() * 10), // 0-9
                duration: tour.duration,
                difficulty: tour.difficulty as 'easy' | 'moderate' | 'difficult',
                maxGroupSize: tour.max_group_size,
                ratingsAvg: tour.rating_avg,
                ratingsQty: tour.rating_qty,
                summary: tour.summary,
                description: tour.description,
            })
            .returning({ tourId: tours.id });

        console.log('🌱 Seeded tour:', result.tourId);

        const tourDates = tour.start_dates.map((date) => {
            return {
                startDate: new Date(date).toISOString(),
                tourId: result.tourId,
            };
        });

        await db.insert(startDates).values(tourDates);
    }
}

void main()
    .then(() => {
        console.log('✅ Database Seeded');
    })
    .catch(() => {
        console.error('❌ Something went wrong seeding the database');
        process.exit(0);
    });
