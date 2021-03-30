import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly title : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly creatorId : string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly channelId : string

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    readonly isGroupChat : boolean 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly createdBy: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly updatedBy: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly creatorName : string

    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly channelName : string

}

export class CreateMessageDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    groupChatID : string


    @IsString()
    @IsNotEmpty()
    conversationId : string

    @IsString()
    @IsNotEmpty()
    senderId : string

    @IsString()
    @IsNotEmpty()
    sectorId : string

    @IsString()
    @IsNotEmpty()
    imageURL : string
    
    @IsString()
    @IsNotEmpty()
    audioURL : string

    @IsString()
    @IsNotEmpty()
    videoURL : string
    
    @IsString()
    @IsNotEmpty()
    message : string

    @IsString()
    @IsNotEmpty()
    deleteFromSender : boolean

    @IsString()
    @IsNotEmpty()
    deleteFromAll : boolean

    @IsString()
    @IsNotEmpty()
    postedOn: Date

}


export class CreateParticipantDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accountId: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly canPost: boolean
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly createdBy: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly groupChatID: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly updatedBy: string
}