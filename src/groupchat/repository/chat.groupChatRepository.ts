import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection, getRepository, getManager } from 'typeorm';
import { GetgroupchatRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/participant.entity'
import { GroupChatEntity } from '../entities/groupchat.entity';
import { ConversationRepository } from 'src/chat/repository/chat.conversationRepository';
import { CreateGroupChatDto } from '../dto/create-groupchat.dto';
import { UpdateGroupchatDto } from '../dto/update-groupchat.dto';


@EntityRepository(GroupChatEntity)
export class GroupChatRepository extends Repository<GroupChatEntity>{
    constructor(private readonly conversationRepo: ConversationRepository) {
        super()
    }

    

    //NOTE: every post to groupchat will route through CONVERSATION

    //get single groupchat and details(participant)
    async getGroupChatById(id: string) {

        const groupchat = await this.find({where:{id: id}, relations:["participants"]});
        return groupchat
    }


    //get list of all groupchat no details
    async getAllGroupChat(): Promise<GetgroupchatRO[]> {
        const groupchat = await getRepository(GroupChatEntity)
            .createQueryBuilder("groupchat")
            .getMany();
        return groupchat
    }



    //create groupchat
    async createGroup(groupchat: CreateGroupChatDto): Promise<CreateGroupChatDto> {

        const newgroupchat = await this.create();
        let groupchatParticipant = []       
        const repository = await getRepository(ParticipantEntity);
        newgroupchat.activateOn = groupchat.activateOn;
        newgroupchat.creatorId = groupchat.creatorId;
        newgroupchat.description = groupchat.description;
        newgroupchat.expiresOn = groupchat.expiresOn;
        newgroupchat.isActive = groupchat.isActive;
        newgroupchat.createdBy = groupchat.createdBy;
        newgroupchat.name = groupchat.name;
        newgroupchat.onlyAdminCanPost = groupchat.onlyAdminCanPost;
        const result = await newgroupchat.save();

        for (let value of groupchat.participant) {
            const newparticipant = new ParticipantEntity()
            newparticipant.accountId = value.accountId;
            newparticipant.canPost = value.canPost;
            newparticipant.createdBy = value.createdBy;
            newparticipant.groupChatID = result.id;     
            
            groupchatParticipant.push(newparticipant);
        }
         await repository.save(groupchatParticipant)
        return groupchat
    }



    //update groupchat ie(to add members) 
    async updateGroupChat(id: string, dto: UpdateGroupchatDto): Promise<GroupChatEntity> {
        const repository = await getRepository(ParticipantEntity);
        let isExist = await GroupChatEntity.findOne(id);

        if (!isExist) {
            throw new HttpException({ message: `No groupchat with this '${id}'` }, HttpStatus.BAD_REQUEST);
        } else {
            //empty the array
            let groupchatParticipant = []    
            let groupChat = Object.assign(isExist, dto);
           const groupchatUpdate = await this.save(groupChat);

           var test = await repository.delete({groupChatID: id})

           for (let value of dto.participant) {
               const newparticipant = new ParticipantEntity()
               newparticipant.accountId = value.accountId;
               newparticipant.canPost = value.canPost;
               newparticipant.createdBy = value.createdBy;
               newparticipant.groupChatID = id;     
               
               groupchatParticipant.push(newparticipant);
           }
            await repository.save(groupchatParticipant)
            return groupchatUpdate
        }
    }


    //Delete a groupchat
    async deleteGroupChat(id: string) {
        const repository = await getRepository(ParticipantEntity);
        await getConnection().createQueryBuilder().delete().from(GroupChatEntity).where("id = :id", {id}).execute();
        this.conversationRepo.deleteConversation(id)
        var test = await repository.delete({groupChatID: id})


    }







}