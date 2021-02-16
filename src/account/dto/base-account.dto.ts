import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export abstract class BaseAccountDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accountPackage: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly phoneNumber: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly country: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly state: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lga: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly city: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly address: string;
    @IsString()
    @ApiProperty()
    readonly pcn: string;
    @IsNumber()
    @ApiProperty()
    readonly longitude: number;
    @IsNumber()
    @ApiProperty()
    readonly latitude: number;
    @IsString()
    @ApiProperty()
    readonly profileImage: string;
}