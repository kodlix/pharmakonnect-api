import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class ArticleDto {

  createdBy: string

  @IsNotEmpty() @ApiProperty()
  title: string;

  @IsNotEmpty() @ApiProperty()
  body: string;

  @IsDefined() @ApiProperty()
  categoryIds: string[];

}
