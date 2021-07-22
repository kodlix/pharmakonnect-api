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
    firstName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phoneNo: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string

    createdBy: string
}
