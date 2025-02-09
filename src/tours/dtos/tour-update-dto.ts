import { PartialType } from '@nestjs/mapped-types';

import { CreateTourDto } from './tour-create-dto';

export class UpdateTourDto extends PartialType(CreateTourDto) {}
