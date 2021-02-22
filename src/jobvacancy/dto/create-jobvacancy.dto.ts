/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateJobVacancyDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Name of corporation is required'})
    nameOfCorporation: string;

    @ApiProperty()
    @IsString()
    yearOfIncorporation: Date;

    @ApiProperty()
    @IsInt()
    companyRegistrationNumber: number;

    @ApiProperty()
    @IsString()
    @IsUrl(undefined,{message: "Company Url is not valid."})
    companyUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Description is required'})
    jobDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Qualification is required'})
    minimumQualification: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Job title is required'})
    jobTitle: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Work experience is required'})
    workExperienceInYears: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Location is required'})
    jobLocation: string;

    @ApiProperty()
    @IsString()
    otherSkills: string;

    @ApiProperty()
    @IsInt()
    minSalary: number;

    @ApiProperty()
    @IsInt()
    maxSalary: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Start date is required'})
    startDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'End date is required'})
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsUrl(undefined,{message: 'Job Url is not valid'})
    jobUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Contract Type is required'})
    contactType: string;

    
}
