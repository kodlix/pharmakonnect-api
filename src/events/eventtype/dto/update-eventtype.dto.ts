import { PartialType } from '@nestjs/mapped-types';
import { CreateEventtypeDto } from './create-eventtype.dto';

export class UpdateEventtypeDto extends PartialType(CreateEventtypeDto) {}
