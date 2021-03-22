import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  
  createdBy?: string

  @IsNotEmpty() @ApiProperty() 
  title?: string;

  @Allow() @ApiProperty()  
  body?: string;

}
