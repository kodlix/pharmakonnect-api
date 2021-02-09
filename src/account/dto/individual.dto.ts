import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { BaseAccountDTO } from "./base-account.dto"

export class IndividualDTO extends BaseAccountDTO {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly firstName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lastName: string;
    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    readonly dateOfBirth: Date;
    @ApiProperty()
    readonly isPracticing: boolean = false;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly gender: string;
}