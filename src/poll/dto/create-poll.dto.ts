import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { pollTypes } from '../poll.constant';
import { CreatePollQuestionDto } from './create-poll-question.dto';

export class CreatePollDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'title of poll is required' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'description of poll is required' })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accessCode: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  requiresRegistration: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Poll type is required' })
  @IsEnum(pollTypes)
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  hint: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Start date is required' })
  endDate: Date;

  @ApiProperty({type: [CreatePollQuestionDto]})
  @IsNotEmpty()
  questions: CreatePollQuestionDto[];

}
