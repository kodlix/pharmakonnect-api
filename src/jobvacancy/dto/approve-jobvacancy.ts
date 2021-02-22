/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ApproveJobVacancyDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    approvedOn: Date;
 
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    approvedBy: string;

}
