import { Exclude, Expose, Transform } from 'class-transformer';
import { StartDateEntity } from '../entities/start-date-entity';
import { TourEntity } from '../entities/tour-entity';

export class TourListDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    duration: number;

    @Expose()
    maxGroupSize: number;

    @Expose()
    difficulty: string;

    // ✅ Transform price from cents to dollars
    @Expose()
    @Transform(({ value }: { value: number }) => (value ? value / 100 : value))
    price: number;

    @Expose()
    discountPercent: number;

    @Expose()
    ratingsAvg?: number;

    @Expose()
    ratingsQty?: number;

    @Exclude()
    isActive: boolean;

    @Expose()
    isFeatured: boolean;

    @Exclude()
    isDeleted: boolean;

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
