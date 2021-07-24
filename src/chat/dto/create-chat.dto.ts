import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {

    @ApiProperty()
    @ApiPropertyOptional()
    readonly title : string

    @ApiPropertyOptional()
    @ApiProperty()
    readonly creatorId : string;

    @ApiPropertyOptional()
    @ApiProperty()
    readonly initiatorId : string; 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly counterPartyName : string; 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly message : string; 

    @ApiPropertyOptional()
    @ApiProperty()
    readonly counterPartyImage : string; 

    @ApiPropertyOptional()
    @ApiProperty()
    readonly initiatorImage : string; 

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly counterPartyId : string;


    @ApiPropertyOptional()
    @ApiProperty()
    readonly channelId : string

    @ApiPropertyOptional()
    @ApiProperty()
    readonly isGroupChat : boolean 

    @ApiPropertyOptional()
    @ApiProperty()
    readonly createdBy: string

    @ApiPropertyOptional()
    @ApiProperty()
    readonly updatedBy: string

    @ApiPropertyOptional()
    @ApiProperty()
    readonly creatorName : string

    
    @ApiPropertyOptional()
    @ApiProperty()
    readonly channelName : string

}

export class CreateMessageDto{
    
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
    recieverId : string

    
    sectorId : string

    
    imageURL : string
    
    
    audioURL : string

    
    videoURL : string
    
    @IsString()
    @IsNotEmpty()
    message : string

    
    deleteFromSender : boolean

   
    deleteFromAll : boolean

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