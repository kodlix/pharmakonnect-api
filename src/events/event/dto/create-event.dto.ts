import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {  IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class CreateEventDto {

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;

    @Expose()
    @IsNumber()
    @ApiProperty()
    @IsNotEmpty({message: 'Number of participants cannot be empty'})
    numberOfParticipants: number;

    @Expose()
    @IsNumber()
    @ApiProperty()
    @ApiPropertyOptional()
    cost: number;

    @Expose()
    @IsDateString()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Date cannot be empty'})
    startDate: Date;

    @Expose()
    @IsDateString()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Date cannot be empty'})
    endDate: Date;

    @Expose()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Time cannot be empty'})
    startTime: Date;

    @Expose()
    @ApiProperty()
    @IsNotEmpty({message: 'End Time cannot be empty'})
    endTime: Date;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Venue cannot be empty'})
    venue: string;

    @Expose()
    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    accessCode: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Organizer Name cannot be empty'})
    organizerName: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Organizer Phone Number cannot be empty'})
    organizerPhoneNumber: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Event Type cannot be empty'})
    eventType: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    url: string;

    @ApiProperty({default: true})
    @ApiPropertyOptional()
    @IsOptional()
    free: boolean

    @ApiProperty({default: true})
    @ApiPropertyOptional()
    @IsOptional()
    active: boolean

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    online: boolean

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    requireAccessCode: boolean;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    requireUniqueAccessCode: boolean;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    requireRegistration: boolean;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    published: boolean;

    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    coverImage: string;

}
