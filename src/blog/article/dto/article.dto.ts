import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class ArticleDto {

  createdBy: string

  @IsNotEmpty() @ApiProperty()
  title: string;

  @IsNotEmpty() @ApiProperty()
  body: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  coverImage: string;  

  @IsDefined() @ApiProperty()
  categoryIds: any;

}

export class RejectArticleDto {

  @IsNotEmpty({message: "Rejection reason is required"}) 
  @ApiProperty()
  message: string;
}
