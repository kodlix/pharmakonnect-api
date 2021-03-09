import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

@Exclude()
export class CreateScheduleMeetingDto {

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'User Id cannot be empty'})
    accountId: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Topic cannot be empty'})
    topic: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @IsOptional()
    description: string;

    @Expose()
    @IsNumber()
    @ApiProperty()
    @IsNotEmpty({message: 'Duration in hours cannot be empty'})
    durationInHours: number;

    @Expose()
    @IsNumber()
    @ApiProperty()
    @IsNotEmpty({message: 'Duration in minutes cannot be empty'})
    durationInMinutes: number;

    @Expose()
    @IsDate()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Date cannot be empty'})
    startDate: Date;

    @Expose()
    @IsDate()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Time cannot be empty'})
    startTime: Date

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Meeting ID cannot be empty'})
    meetingID: string;

    @Expose()
    @IsString()
    @ApiProperty()
    passcode: string;
}
