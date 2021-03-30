import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator/types/decorator/decorators';
import { CreatePollQuestionDto } from './create-poll-question.dto';
import { CreatePollDto } from './create-poll.dto';

export class UpdatePollQuestionDto extends PartialType(CreatePollQuestionDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
