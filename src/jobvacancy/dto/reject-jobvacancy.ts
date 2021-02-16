import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class RejectJobVacancyDto{
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    rejected: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rejectedBy: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty() 
    rejectionMessage: string;
}