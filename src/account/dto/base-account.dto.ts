import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
    @ApiPropertyOptional()
    readonly pcn: string;
    @IsNumber()
    @ApiProperty()
    readonly longitude: number;
    @IsNumber()
    @ApiProperty()
    readonly latitude: number;
    @ApiProperty()
    readonly profileImage: string;
    @ApiProperty()
    isRegComplete: boolean;    
    @ApiProperty()
    readonly typesOfPractice: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly countryName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly stateName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lgaName: string;
}