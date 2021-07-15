import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateGroupContactDto {

    ownerId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly groupId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly contactId: string

    createdBy: string
}
