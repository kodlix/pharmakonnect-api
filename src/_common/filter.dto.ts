import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterDto {

    @ApiProperty()
    @ApiPropertyOptional()
    search: string;

    @ApiProperty()
    @ApiPropertyOptional()
    groupId: string;

    @ApiProperty()
    @ApiPropertyOptional()
    page: number;

    @ApiProperty()
    @ApiPropertyOptional()
    take: number;
}

export class ContactAdvanceFilter {

    @ApiProperty()
    @ApiPropertyOptional()
    search: string;

    @ApiProperty()
    @ApiPropertyOptional()
    id: string

    @ApiProperty()
    @ApiPropertyOptional()
    ownerId: string

    @ApiProperty()
    @ApiPropertyOptional()
    groupName: string

    @ApiProperty()
    @ApiPropertyOptional()
    groupDescription: string;

    @ApiProperty()
    @ApiPropertyOptional()
    email: string;

    @ApiProperty()
    @ApiPropertyOptional()
    firstName: string;

    @ApiProperty()
    @ApiPropertyOptional()
    lastName: string;

    @ApiProperty()
    @ApiPropertyOptional()
    organizationName: string;

    @ApiProperty()
    @ApiPropertyOptional()
    address: string;

    @ApiProperty()
    @ApiPropertyOptional()
    city: string;

    @ApiProperty()
    @ApiPropertyOptional()
    state: number;

    @ApiProperty()
    @ApiPropertyOptional()
    lga: number;

    @ApiProperty()
    @ApiPropertyOptional()
    typesOfPractice: string;

    @ApiProperty()
    @ApiPropertyOptional()
    phoneNumber: string;

    @ApiProperty()
    @ApiPropertyOptional()
    pcn: string;

    @ApiProperty()
    @ApiPropertyOptional()
    gender: string;

    @ApiProperty()
    @ApiPropertyOptional()
    yearOfGraduation: string;

    @ApiProperty()
    @ApiPropertyOptional()
    schoolOfGraduation: string;
}