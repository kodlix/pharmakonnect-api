import { IsNotEmpty, IsArray, IsString, IsBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateGroupContactDto {

    @IsNotEmpty()
    @ApiProperty()
    groupId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    members: string[]

    @ApiProperty({ default: false })
    addMembersToContact: boolean;
}

export class CreateNewGroupAndContactDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    members: string[]
}
