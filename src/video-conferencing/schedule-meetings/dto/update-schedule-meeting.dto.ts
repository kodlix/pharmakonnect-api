import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Exclude, Expose } from "class-transformer";



export class UpdateScheduleMeetingDto {

    @Expose()
    @IsString()
    @ApiProperty()
    @IsNotEmpty({message: 'Topic cannot be empty'})
    topic: string;

    @Expose()
    @IsString()
    @ApiProperty()
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
    @IsDateString()
    @ApiProperty()
    @IsNotEmpty({message: 'Start Date cannot be empty'})
    startDate: Date;

    @Expose()
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

    @ApiProperty()
    @IsOptional()
    muteParticipantOnEntry: boolean;

    @ApiProperty()
    @IsOptional()
    recordMeeting: boolean;

    @ApiProperty()
    @IsOptional()
    allowParticipantJoinAnytime: boolean;

    @ApiProperty()
    @IsOptional()
    waitingRoom: boolean

    @ApiProperty()
    @IsOptional()
    hostVideo: boolean;

    @ApiProperty()
    @IsOptional()
    participantVideo: boolean;
}
