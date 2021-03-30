import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator/types/decorator/decorators';
import { CreatePollVoteDto } from './create-poll-vote.dto';

export class UpdatePollVoteDto extends PartialType(CreatePollVoteDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
