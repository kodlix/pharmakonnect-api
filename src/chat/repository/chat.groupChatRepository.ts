import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection, getRepository } from 'typeorm';
import { GetgroupchatRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/chat.participant'
import { GroupChatEntity } from '../entities/chat.groupChat';
import { ConversationRepository } from './chat.conversationRepository';
import { CreateGroupChatDto } from '../dto/create-chat.dto';

@EntityRepository(GroupChatEntity)
export class GroupChatRepository extends Repository<GroupChatEntity>{
    constructor(private readonly conversationRepo: ConversationRepository) {
        super()
    }

    //NOTE: every post to groupchat will route through CONVERSATION

    //get single groupchat and details(participant)
    async getGroupChatById(id: string) {
        const groupchat = await this.createQueryBuilder("groupchat")
            .innerJoinAndSelect("groupchat.id", "Participant")
            .where("groupchat.id = :id").getOne();
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
    async createGroup(groupchat: GroupChatEntity): Promise<GroupChatEntity> {

        const newgroupchat = await GroupChatEntity.create();
        newgroupchat.activateOn = groupchat.activateOn;
        newgroupchat.creatorId = groupchat.creatorId;
        newgroupchat.description = groupchat.description;
        newgroupchat.expiresOn = groupchat.expiresOn;
        newgroupchat.isActive = groupchat.isActive;
        newgroupchat.createdBy = groupchat.createdBy;
        newgroupchat.name = groupchat.name;
        newgroupchat.onlyAdminCanPost = groupchat.onlyAdminCanPost;

        const result = await newgroupchat.save();

        newgroupchat.participants.forEach(async function (value) {
            const newparticipant = await ParticipantEntity.create();
            newparticipant.accountId = value.accountId;
            newparticipant.canPost = value.canPost;
            newparticipant.createdBy = value.createdBy;
            newparticipant.groupChatID = result.id;
            newparticipant.updatedBy = value.updatedBy;

            await newparticipant.save();
        })

        return result
    }



    //update groupchat ie(to add members) 
    async updateGroupChat(id: string, dto: GroupChatEntity): Promise<GroupChatEntity> {
        const isExist = await GroupChatEntity.findOne(id);

        if (isExist === null) {
            throw new HttpException({ message: `No groupchat with this '${id}'` }, HttpStatus.BAD_REQUEST);
        } else {
            const groupChat = await GroupChatEntity.preload(dto);
            await groupChat.save();
            return this.findOne({
                where: { id: groupChat.id },
                relations: ['participant']
            })
        }
    }


    //Delete a groupchat
    async deleteGroupChat(id: string) {
        await getConnection().createQueryBuilder().delete().from(GroupChatEntity).where("id = :id").execute();
        this.conversationRepo.deleteConversation(id)


    }







}