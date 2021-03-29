import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePollVoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pollId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pollType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  optionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  phonenumber: string;
}
