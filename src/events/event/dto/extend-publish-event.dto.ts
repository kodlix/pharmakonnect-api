
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {  IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { TargetAudience } from "src/enum/enum";


export class ExtendPublishEventDto {

  
    @Expose()
    @ApiProperty()
    @IsNotEmpty({message: 'End Date cannot be empty'})
    endDate: Date;

    @Expose()
    @ApiProperty()
    @IsNotEmpty({message: 'End Time cannot be empty'})
    endTime: Date;

}

