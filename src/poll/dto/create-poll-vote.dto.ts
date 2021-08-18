import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  pollOptions : CreatePollVoteOptionDto[]
}

export class CreatePollVoteOptionDto {
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
  @IsNotEmpty()
  questionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionType: string;

}

export class RejectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: "message is required"})
  message: string;
}




