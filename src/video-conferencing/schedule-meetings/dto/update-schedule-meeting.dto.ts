import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator"


export class UpdateScheduleMeetingDto {
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Topic cannot be empty'})
    topic: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Duration cannot be empty'})
    duration: string;

    @IsDate()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Date cannot be empty'})
    startDate: Date;

    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Meeting ID cannot be empty'})
    meetingID: string;

    @IsString()
    @ApiProperty()
    passcode: string;
}
