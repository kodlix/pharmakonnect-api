import { IsNotEmpty, IsString, IsBoolean, isBoolean } from "class-validator"

export class CreateConversationDto {
    @IsString()
    @IsNotEmpty()
    readonly title : string

    @IsString()
    @IsNotEmpty()
    readonly creatorId : string

    @IsString()
    @IsNotEmpty()
    readonly channelId : string

    @IsBoolean()
    @IsNotEmpty()
    readonly isGroupChat : boolean 

    @IsString()
    @IsNotEmpty()
    readonly createdBy: string

    @IsString()
    @IsNotEmpty()
    readonly updatedBy: string

}


export class CreateGroupChatDto{
    @IsString()
    @IsNotEmpty()
    readonly creatorId : string

    @IsString()
    @IsNotEmpty()
    readonly sectorId : string

    @IsString()
    @IsNotEmpty()
    readonly name : string

    @IsString()
    @IsNotEmpty()
    readonly description : string

    @IsString()
    @IsNotEmpty()
    readonly onlyAdminCanPost : boolean

    @IsString()
    @IsNotEmpty()
    readonly isActive : boolean

    @IsString()
    @IsNotEmpty()
    readonly activateOn : Date

    @IsString()
    @IsNotEmpty()
    readonly expiresOn : Date

    @IsString()
    @IsNotEmpty()
    readonly createdBy : string


    @IsString()
    @IsNotEmpty()
    readonly participants : []

    @IsString()
    @IsNotEmpty()
    readonly messages : []
}


export class CreateMessageDto{
    @IsString()
    @IsNotEmpty()
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