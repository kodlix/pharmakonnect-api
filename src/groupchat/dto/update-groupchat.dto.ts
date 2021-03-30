import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupchatDto } from './create-groupchat.dto';
import { IsNotEmpty, IsString, IsBoolean, isBoolean, IsDate, IsArray } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
import { CreateParticipantDto } from "src/chat/dto/create-chat.dto";


export class UpdateGroupchatDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly creatorId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly sectorId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly description : string

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    readonly onlyAdminCanPost : boolean

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    readonly isActive : boolean

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly activateOn : Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly expiresOn : Date

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly createdBy : string


    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    readonly participant : CreateParticipantDto[]
}
