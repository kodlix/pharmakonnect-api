/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { IsString, IsNotEmpty, IsEmail, IsInt, IsBoolean } from 'class-validator';

export class CreateJobVacancyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nameOfCorporation: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    yearOfIncorporation: Date;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    companyRegistrationNumber: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    companyUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    jobDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    minimumQualification: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    jobTitle: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    workExperienceInYears: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    jobLocation: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otherSkills: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    minSalary: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    maxSalary: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    jobUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactType: string;

  
}
