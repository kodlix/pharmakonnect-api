import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, Min, ValidateIf } from 'class-validator';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateJobVacancyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name of corporation is required' })
  nameOfCorporation: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: 'Year of InCorporation is required'})
  yearOfIncorporation: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyRegistrationNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  //@IsUrl(undefined, { message: 'Company Url is not valid.' })
  companyUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  jobDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Qualification is required' })
  minimumQualification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  jobTitle: string;

  @ApiProperty()
  @IsInt({ message: 'Work experience should be in numbers' })
  @IsNotEmpty({ message: 'Work experience is required' })
  @Min(0, { message: 'Work Experience can not be a negative value' })
  workExperienceInYears: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  jobLocation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  otherSkills: string;

  @ApiProperty()
  @IsInt({ message: 'Minimum Salary should be in numbers' })
  @Min(-1, { message: 'Minimum Salary can not be a negative value' })
  minSalary: number;

  @ApiProperty()
  @IsInt({ message: 'Maximum Salary should be in numbers' })
  @Min(-1, { message: 'Maximum Salary can not be a negative value' })
  maxSalary: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
//@IsUrl(undefined, { message: 'Job Url is not valid' })
  jobUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Contract Type is required' })
  contactType: string;
}
