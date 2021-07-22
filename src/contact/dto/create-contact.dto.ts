import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class CreateContactDto {
    creatorId: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accountId: string

    createdBy: string
}
