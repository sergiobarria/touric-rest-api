import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { StartDateEntity } from './start-date-entity';

export class TourEntity {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    duration: number;

    // ✅ Virtual Property: Computed value for duration in weeks
    @Expose()
    get durationInWeeks(): string {
        return (this.duration / 7).toFixed(1);
    }

    @Expose()
    maxGroupSize: number;

    @Expose()
    @IsEnum(['easy', 'moderate', 'difficult'])
    difficulty: 'easy' | 'moderate' | 'difficult' | null;

    // ✅ Transform price from cents to dollars
    @Expose()
    @Transform(({ value }: { value: number }) => (value ? value / 100 : value))
    price: number;

    @Expose()
    discountPercent?: number | null;

    @Expose()
    ratingsAvg: number | null;

    @Expose()
    ratingsQty: number | null;

    @Expose()
    summary: string | null;

    @Expose()
    description: string | null;

    @Exclude()
    isActive: boolean | null;

    @Expose()
    isFeatured: boolean | null;

    @Exclude()
    isDeleted: boolean | null;

    @Expose()
    @Transform(({ value }: { value: { startDate: string }[] }) => {
        if (!Array.isArray(value)) return value; // Ensure it's an array

        return value.map(({ startDate }) => new Date(startDate).toISOString());
    })
    startDates: StartDateEntity[] | null;

    constructor(partial: Partial<TourEntity>) {
        Object.assign(this, partial);
    }
}
