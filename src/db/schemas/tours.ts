import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { defaultColumns, idColumn } from './helpers';

export const tours = sqliteTable('tours', {
    ...defaultColumns,
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    duration: integer('duration').notNull(),
    maxGroupSize: integer('max_group_size').notNull(),
    difficulty: text('difficulty', { enum: ['easy', 'moderate', 'difficult'] })
        .notNull()
        .default('moderate'),
    price: integer('price').notNull(),
    discountPercent: integer('discount_percent').default(0),
    ratingsAvg: integer('ratings_avg'),
    ratingsQty: integer('ratings_qty'),
    summary: text('summary'),
    description: text('description'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
    isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false),
});

export const startDates = sqliteTable(
    'start_dates',
    {
        id: idColumn,
        startDate: text('start_date').notNull(),
        tourId: text('tour_id')
            .notNull()
            .references(() => tours.id, { onDelete: 'cascade', onUpdate: 'no action' }),
    },
    (table) => [index('tour_id_idx').on(table.tourId)],
);

export const toursRelations = relations(tours, ({ many }) => ({
    startDates: many(startDates),
}));

export const startDatesRelations = relations(startDates, ({ one }) => ({
    tour: one(tours, {
        fields: [startDates.tourId],
        references: [tours.id],
    }),
}));
