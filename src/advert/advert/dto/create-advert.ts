import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsNumber, IsPositive } from "class-validator";

export class CreateAdvertDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    publishedAt: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    advertserId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    advertCategory: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    zone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    website: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPerson: string;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPhoneNumber: string;
}