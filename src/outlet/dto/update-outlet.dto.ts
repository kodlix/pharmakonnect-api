import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateOutletDto{
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
    organizationName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lga: string

}