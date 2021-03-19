import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
    @ApiPropertyOptional()
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
    @IsNotEmpty({message: 'Meeting ID cannot be empty'})
    @ApiProperty()
    passcode: string;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    muteParticipantOnEntry: boolean;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    recordMeeting: boolean;

    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    allowParticipantJoinAnytime: boolean;

    @ApiProperty({default: false})
    @ApiPropertyOptional()
    @IsOptional()
    waitingRoom: boolean

    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    hostVideo: boolean;

    @ApiProperty()
    @ApiPropertyOptional()
    @IsOptional()
    participantVideo: boolean;

}
