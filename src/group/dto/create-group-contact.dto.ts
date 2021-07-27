import { IsNotEmpty, IsArray } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateGroupContactDto {
   
    @IsNotEmpty()
    @ApiProperty()
    groupId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    readonly members : string[]
}
