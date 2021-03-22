

export interface GetgroupchatRO{

    creatorId : string

    name : string

    description : string

    onlyAdminCanPost : boolean

    isActive : boolean

    activateOn : Date

    expiresOn : Date

    createdBy: string

    updatedBy: string
    
    createdAt: Date

    updatedAt: Date

    isDeleted: boolean

    


}

export interface MessagerRO{
   
    groupChatID : string

    conversationId : string

    senderId : string

    sectorId : string
 
    imageURL : string
    
    audioURL : string

    videoURL : string
    
    message : string

    deleteFromSender : boolean

    deleteFromAll : boolean

    postedOn: Date

    createdBy: string

    updatedBy: string

    createdAt: Date

    updatedAt: Date

    isDeleted: boolean

    isSystemDefined: boolean

}