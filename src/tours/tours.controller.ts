import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';

import { CreateTourDto } from './dtos/tour-create-dto';
import { TourListDto } from './dtos/tour-list-dto';
import { UpdateTourDto } from './dtos/tour-update-dto';
import { TourEntity } from './entities/tour-entity';
import { ToursService } from './tours.service';

@Controller({
    path: 'tours',
    version: '1',
})
export class ToursController {
    constructor(private toursService: ToursService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateTourDto): Promise<TourEntity> {
        return await this.toursService.create(payload);
    }

    @Get()
    async findAll(): Promise<TourListDto[]> {
        return await this.toursService.findAll();
    }

    @Get('top-rated')
    async findTopRatedTours(): Promise<TourListDto[]> {
        return await this.toursService.findTopRatedTours();
    }

    @Get('stats')
    async getTourStats() {
        return await this.toursService.getTourStats();
    }

    @Get('monthly-plan/:year')
    async getMonthlyPlan(@Param('year') year: number) {
        return await this.toursService.getMonthlyPlan(year);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<TourEntity> {
        return await this.toursService.findById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() payload: UpdateTourDto): Promise<TourEntity> {
        return await this.toursService.update(id, payload);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return await this.toursService.remove(id);
    }
}
