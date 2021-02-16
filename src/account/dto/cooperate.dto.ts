import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BaseAccountDTO } from "./base-account.dto";

export class CooperateDTO extends BaseAccountDTO {

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
    @IsString()
    @ApiProperty()
    readonly premisesImage: string;
    @IsString()
    @ApiProperty()
    readonly companyRegistrationNumber: string;
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
