/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { IsString, IsNotEmpty, IsInt, isURL } from 'class-validator';

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
    @IsNotEmpty({message: 'Url is required'})
    @IsUrl(undefined,{message: "Company Url must be a URL."})
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
    @IsNotEmpty({message: 'Jobtitle is require'})
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
    @IsNotEmpty({message: 'Skills is required'})
    otherSkills: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty({message: 'Min salary is require'})
    minSalary: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty({message: 'Max salary is required'})
    maxSalary: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Start date is require'})
    startDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'End date is required'})
    endDate: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Url is required'})
    @IsUrl(undefined,{message: 'Job Url must be a url'})
    jobUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: 'Contract Type is required'})
    contactType: string;

  
}
