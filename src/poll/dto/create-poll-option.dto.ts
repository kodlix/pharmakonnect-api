import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { pollQuestionType, pollTypes } from '../poll.constant';

export class CreatePollOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Poll is required' })
  pollId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Question is required' })
  questionId: string;

  @ApiProperty()
  @IsString()
  @IsEnum(pollQuestionType)
  questionType: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'option has no content' })
  @IsString()
  content: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}
