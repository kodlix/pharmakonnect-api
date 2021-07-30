/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsNumber, isNumber } from "class-validator";

export class CreateOutletDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPerson: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPersonEmail: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactPersonPhonenumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pcn: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()  
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()   
    openingTime: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty() 
    closingTime: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty() 
    city: string;

    
    // @ApiProperty()
    // @IsNumber()
    // longitude: Number;
    
    // @ApiProperty()
    // @IsNumber()
    // latitude: Number;

    @ApiProperty()
    @IsNumber()
    zipCode: Number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    countryId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    countryName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    stateId: string;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    stateName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lgaName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lgaId: string;

}