import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
}

export default defineConfig({
    schema: './src/db/schemas',
    out: './drizzle',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN as string,
    },
});
