/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectJobVacancyDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rejectedBy: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rejectionMessage: string;
}
