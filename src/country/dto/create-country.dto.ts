import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCountryDto {

    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly capital: string;
    
}
