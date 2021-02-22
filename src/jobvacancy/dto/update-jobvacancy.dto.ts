import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, Matches, Min } from 'class-validator';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateJobVacancyDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name of corporation is required' })
  nameOfCorporation: string;

  @ApiProperty()
  @IsString()
  yearOfIncorporation: Date;

  @ApiProperty()
  @IsInt()
  companyRegistrationNumber: number;

  @ApiProperty()
  @IsString()
  @IsUrl(undefined, { message: 'Company Url is not valid.' })
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
  @IsNotEmpty({ message: 'Work experience is required' })
  @IsInt()
  @Min(0, { message: 'Work Experience can not be a negative value' })
  workExperienceInYears: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  jobLocation: string;

  @ApiProperty()
  @IsString()
  otherSkills: string;

  @ApiProperty()
  @IsInt({ message: 'Salary should be in numbers' })
  @Min(0, { message: 'Salary can not be a negative value' })
  minSalary: number;

  @ApiProperty()
  @IsInt({ message: 'Salary should be in numbers' })
  @Min(0, { message: 'Salary can not be a negative value' })
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
  @IsString()
  @IsUrl(undefined, { message: 'Job Url is not valid' })
  jobUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Contract Type is required' })
  contactType: string;
}
