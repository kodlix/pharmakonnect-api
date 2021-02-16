/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class ApproveJobVacancyDto {

    @ApiProperty()
    @IsString()
    @IsEmpty()
    approvedOn: Date;
 
    @ApiProperty()
    @IsString()
    @IsEmpty()
    approvedBy: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    approved: boolean;

}
