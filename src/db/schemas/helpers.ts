import { sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const idColumn = text('id')
    .primaryKey()
    .$defaultFn(() => nanoid());

export const defaultColumns = {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid()),
    createdAt: text('create_at')
        .notNull()
        .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at').$onUpdateFn(() => sql`(current_timestamp)`),
};
