import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLgaDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;

    @IsString()
    readonly createdBy: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly stateId: string;

}
