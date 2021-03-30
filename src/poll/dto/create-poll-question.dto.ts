import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { pollQuestionType, pollTypes } from '../poll.constant';

export class CreatePollQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Poll is required' })
  pollId: string;

  @ApiProperty()
  @IsPositive({message: "Question number must be positive"})
  @IsNotEmpty({ message: 'Question number is required' })
  @IsNumber()
  SN: Number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Poll type is required' })
  @IsEnum(pollTypes)
  pollType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'question type is required' })
  @IsEnum(pollQuestionType)
  questionType: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'question has no content' })
  @IsString()
  content: string;
}
