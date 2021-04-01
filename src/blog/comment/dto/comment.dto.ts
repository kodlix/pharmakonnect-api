import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {

  @IsNotEmpty() @ApiProperty()
  message: string;

  createdBy: string

}
