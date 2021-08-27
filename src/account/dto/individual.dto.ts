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
    @IsNotEmpty()
    @ApiProperty()
    readonly dateOfBirth: Date;
    @ApiProperty()
    readonly isPracticing: boolean;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly gender: string;
    @ApiProperty()
    readonly organizationName: string;
    @ApiProperty()
    readonly organizationType: string;
    @ApiProperty()
    organizationCategory:string;
    @ApiProperty()
    readonly organizationId: string;
    @ApiProperty()
    readonly profession: string;
    @ApiProperty()
    readonly professionalGroup: string;
    // @IsString()
    // @IsNotEmpty()
    @ApiProperty()
    readonly yearOfGraduation: string;
    // @IsString()
    // @IsNotEmpty()
    @ApiProperty()
    readonly school: string;
    @ApiProperty()
    schoolOtherValue: string;
}