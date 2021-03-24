import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator/types/decorator/decorators';
import { CreatePollUserDto } from './create-poll-user.dto';

export class UpdatePollUserDto extends PartialType(CreatePollUserDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
