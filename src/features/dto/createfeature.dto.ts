/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateFeatureDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    valueType: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    unit: string;

}