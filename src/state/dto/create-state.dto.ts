import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateStateDto {

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
    readonly countryId: number;
}
