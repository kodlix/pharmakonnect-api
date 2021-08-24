import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseAccountDTO } from "./base-account.dto";

export class CorperateDTO extends BaseAccountDTO {

    readonly id: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly organizationName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly organizationType: string;
    @IsInt()
    @ApiProperty()
    readonly numberofEmployees: number;
    @ApiProperty()
    readonly premiseNumber: string;
    @ApiProperty()
    readonly premisesImage: string;
    @IsString()
    @ApiProperty()
    readonly companyRegistrationNumber: string;
    @IsString()
    @ApiProperty()
    readonly organizationCategory: string;
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    readonly yearofEstablishment: number;
    @ApiProperty()
    readonly openingTime: Date;
    @ApiProperty()
    readonly closingTime: Date;
    @IsString()
    @ApiProperty()
    readonly website: string;
}
