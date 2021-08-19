import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateResourceTypeDto {
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

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Module cannot be empty'})
    module: string;

}
