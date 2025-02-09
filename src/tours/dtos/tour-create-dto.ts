import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateTourDto {
    @IsString()
    name: string;

    @IsInt()
    @Min(1)
    duration: number;

    @IsInt()
    @Min(1)
    maxGroupSize: number;

    @IsEnum(['easy', 'moderate', 'difficult'])
    difficulty: 'easy' | 'moderate' | 'difficult';

    @IsInt()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    discountPercent?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    ratingsAvg?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    ratingsQty?: number;

    @IsString()
    @IsOptional()
    summary?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    startDates: string[];
}
