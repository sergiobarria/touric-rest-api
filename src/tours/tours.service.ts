import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { avg, count, desc, eq, max, min, sql, sum } from 'drizzle-orm';
import slugify from 'slugify';

import { DrizzleAsyncProvider, DrizzleDB } from 'src/db/db.module';
import { startDates, tours } from 'src/db/schemas';
import { CreateTourDto } from './dtos/tour-create-dto';
import { TourListDto } from './dtos/tour-list-dto';
import { UpdateTourDto } from './dtos/tour-update-dto';
import { TourEntity } from './entities/tour-entity';

@Injectable()
export class ToursService {
    constructor(@Inject(DrizzleAsyncProvider) private db: DrizzleDB) {}

    private async findTourById(id: string) {
        const result = await this.db.query.tours.findFirst({
            where: (records, { eq }) => eq(records.id, id),
            columns: { createdAt: false, updatedAt: false },
            with: { startDates: { columns: { startDate: true } } },
        });
        if (!result) throw new NotFoundException('Tour not found');

        return result;
    }

    async create(payload: CreateTourDto): Promise<TourEntity> {
        const { startDates: startDatesArr, ...tourData } = payload;

        const result = await this.db.transaction(async (tx) => {
            // Insert the tour
            const [result] = await tx
                .insert(tours)
                .values({
                    ...tourData,
                    price: tourData.price * 100, // Convert to cents
                    slug: slugify(tourData.name, { lower: true }),
                })
                .returning({ newTourId: tours.id });

            if (!result) throw new BadRequestException('Failed to create tour');

            // Insert the start dates
            if (startDatesArr.length > 0) {
                await tx.insert(startDates).values(
                    startDatesArr.map((date) => ({
                        tourId: result.newTourId,
                        startDate: date,
                    })),
                );
            }

            // Find the newly created tour
            const newTour = await tx.query.tours.findFirst({
                where: (records, { eq }) => eq(records.id, result.newTourId),
                with: { startDates: { columns: { startDate: true } } },
            });

            if (!newTour) throw new NotFoundException('Tour not found');

            return newTour;
        });

        return new TourEntity(result);
    }

    async findAll(): Promise<TourListDto[]> {
        const result = await this.db.query.tours.findMany({
            where: (records, { eq }) => eq(records.isActive, true),
            columns: { createdAt: false, updatedAt: false, description: false },
            with: {
                startDates: {
                    columns: { startDate: true },
                },
            },
        });

        return result.map((tour) => new TourListDto(tour));
    }

    async findById(id: string): Promise<TourEntity> {
        const result = await this.findTourById(id);

        return new TourEntity(result);
    }

    async update(id: string, payload: UpdateTourDto): Promise<TourEntity> {
        const tour = await this.db.transaction(async (tx) => {
            const existingTour = await tx.query.tours.findFirst({
                where: (records, { eq }) => eq(records.id, id),
            });
            if (!existingTour) throw new NotFoundException('Tour not found');

            const { startDates: newStartDates, ...updateData } = payload;

            const slug = updateData.name
                ? slugify(updateData.name, { lower: true })
                : existingTour.slug;

            if (updateData.name) {
                // Ensure the new slug is unique
                const existingSlug = await tx.query.tours.findFirst({
                    where: (t) => eq(t.slug, slug),
                });

                if (existingSlug && existingSlug.id !== id) {
                    throw new BadRequestException('A tour with this name already exists');
                }
            }

            await tx
                .update(tours)
                .set({ ...updateData, slug })
                .where(eq(tours.id, id));

            if (newStartDates) {
                await tx.delete(startDates).where(eq(startDates.tourId, id));

                await tx.insert(startDates).values(
                    newStartDates.map((date) => ({
                        tourId: id,
                        startDate: new Date(date).toISOString(),
                    })),
                );
            }

            const updatedTour = await tx.query.tours.findFirst({
                where: (records) => eq(records.id, id),
                with: { startDates: { columns: { startDate: true } } },
            });
            if (!updatedTour) throw new NotFoundException('Tour not found');

            return updatedTour;
        });

        return new TourEntity(tour);
    }

    async remove(id: string): Promise<void> {
        await this.findTourById(id); // Ensure the tour exists

        await this.db.delete(tours).where(eq(tours.id, id));

        return;
    }

    async findTopRatedTours(): Promise<TourListDto[]> {
        const result = await this.db.query.tours.findMany({
            where: (records) => eq(records.isActive, true),
            columns: { createdAt: false, updatedAt: false, description: false },
            with: {
                startDates: { columns: { startDate: true } },
            },
            orderBy: (records, { desc }) => [desc(records.ratingsAvg), desc(records.price)],
            limit: 5,
        });

        return result.map((tour) => new TourListDto(tour));
    }

    async getTourStats() {
        const result = await this.db
            .select({
                difficulty: tours.difficulty,
                numTours: count(),
                numRatings: sum(tours.ratingsQty).mapWith(Number),
                avgRating: avg(tours.ratingsAvg).mapWith(Number),
                avgPrice: avg(tours.price).mapWith(Number),
                minPrice: min(tours.price).mapWith(Number),
                maxPrice: max(tours.price).mapWith(Number),
            })
            .from(tours)
            .groupBy(tours.difficulty)
            .orderBy(tours.price);

        return result;
    }

    async getMonthlyPlan(year: number) {
        const startDateColumn = sql`DATE(${startDates.startDate})`;

        const result = await this.db
            .select({
                month: sql<number>`CAST(strftime('%m', ${startDateColumn}) AS INTEGER)`,
                numTourStarts: count(),
                tours: sql<string>`group_concat(${tours.name}, ', ')`,
            })
            .from(startDates)
            .innerJoin(tours, eq(startDates.tourId, tours.id))
            .where(
                sql`${startDateColumn} BETWEEN ${new Date(`${year}-01-01`).toISOString()} AND ${new Date(`${year}-12-31`).toISOString()}`,
            )
            .groupBy(sql`strftime('%m', ${startDateColumn})`)
            .orderBy(desc(count()))
            .limit(12);

        return result;
    }
}
