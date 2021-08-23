import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTypeOfPracticeDto {
    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Description cannot be empty'})
    description: string;

}
