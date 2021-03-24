import { PartialType } from '@nestjs/mapped-types';
import { CreateEventuserDto } from './create-eventuser.dto';

export class UpdateEventuserDto extends PartialType(CreateEventuserDto) {}
