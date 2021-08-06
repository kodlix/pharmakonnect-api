import { IsNotEmpty, IsString, IsBoolean, isBoolean, IsArray } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateContactDto {
    creatorId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phoneNumber: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    createdBy: string
}
