import { Expose } from 'class-transformer';

export class StartDateEntity {
    @Expose()
    id?: string;

    @Expose()
    startDate: string;

    @Expose()
    tourId?: string;
}
