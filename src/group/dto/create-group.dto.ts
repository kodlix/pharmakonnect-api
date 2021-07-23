import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateGroupDto {

    ownerId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly logo: string

    createdBy: string
}
