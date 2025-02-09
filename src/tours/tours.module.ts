import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

@Module({
    providers: [ToursService],
    controllers: [ToursController],
    imports: [DbModule],
})
export class ToursModule {}
