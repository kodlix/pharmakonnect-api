import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePollDto } from './create-poll.dto';

export class UpdatePollDto extends PartialType(CreatePollDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
