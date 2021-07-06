import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateContactDto {

    creatorId: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accountId: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly firstName: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lastName: string


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly phoneNo: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string

    createdBy: string
}
