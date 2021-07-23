/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEmail } from "class-validator";
import { isBoolean } from 'class-validator';

export class CreateAdvertDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsUrl()
    url: string;

    @ApiProperty()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Incorrect email' })
    advertiserId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    advertCategory: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    zone: string;

    @ApiProperty()
    @IsOptional()
    autoRenewal: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName:string;

    @ApiProperty()
    @IsString()
    @IsUrl()
    website: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPerson: string;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPhoneNumber: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    advertImage: string;


}