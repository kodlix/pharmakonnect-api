import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator/types/decorator/decorators';
import { CreatePollOptionDto } from './create-poll-option.dto';

export class UpdatePollOptionDto extends PartialType(CreatePollOptionDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

