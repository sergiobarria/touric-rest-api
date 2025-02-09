import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().optional().default(3000),
    DATABASE_URL: z.string().nonempty(),
    DATABASE_AUTH_TOKEN: z.string().nonempty(),
});

export type AppConfig = z.infer<typeof envSchema>;
