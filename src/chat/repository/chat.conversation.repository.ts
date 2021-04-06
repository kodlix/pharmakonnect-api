import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { ConversationEntity } from 'src/chat/entities/conversation.entity'
import { ConversationRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/participant.entity'
import { CreateConversationDto } from 'src/chat/dto/create-chat.dto';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity>{

    async getConversationById(user: any): Promise<ConversationRO[]> {
        const getConversationList = await ConversationEntity.find({
            where: [{ creatorId: user },
            { channelId: user }]
        })
        let conversationList = []
        for (const item of getConversationList) {
            item.initiatorId = user

            conversationList.push(item);            
        }

        return conversationList.sort(function(a, b){return a.updatedOn - b.updatedOn});
    }

    async getConversationPaticipantMessage(creatorid: string, channelid: string){
        try {
            const conversation = await this.findOne({
                where: [{ creatorId: creatorid, channelId: channelid }, { creatorId: channelid, channelId: creatorid }],
                relations: ["participants", "messages"]
            })
            return conversation;            
        } catch (error) {
            throw new HttpException(
              { error: `An error occured`, status: HttpStatus.INTERNAL_SERVER_ERROR },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        

    }

    async createOrUpdateConversation(dto: CreateConversationDto, user: any): Promise<CreateConversationDto> {

        const exist = await this.findOne({
            where: [{ creatorId: dto.creatorId, channelId: dto.channelId }, { creatorId: dto.channelId, channelId: dto.creatorId }]
        })
        if (!exist) {


            if (!dto.isGroupChat) {
                const convers = await ConversationEntity.create()
                convers.isGroupChat = dto.isGroupChat;
                convers.title = dto.title;
                convers.channelId = dto.channelId;
                convers.createdBy = dto.creatorName;
                convers.creatorId = dto.creatorId;
                convers.updatedOn = new Date();
                convers.updatedBy = dto.updatedBy;
                convers.channelName = dto.channelName;
                convers.creatorName = dto.creatorName;

                const result = await ConversationEntity.save(convers);
                //Call create MESSAGE end point
                return result
            } else {
                let groupchatConversation = [];
                const getparticipant = await ParticipantEntity.find({ where: { groupChatID: dto.creatorId } });

                const conversadmin = await ConversationEntity.create()
                conversadmin.isGroupChat = dto.isGroupChat;
                conversadmin.title = dto.title;
                conversadmin.channelId = dto.channelId;
                conversadmin.createdBy = dto.createdBy;
                conversadmin.creatorId = dto.creatorId;
                conversadmin.updatedOn = new Date();
                conversadmin.updatedBy = dto.updatedBy;
                conversadmin.creatorName = dto.creatorName;
                conversadmin.channelName = dto.channelName;

                groupchatConversation.push(conversadmin);

                for (let value of getparticipant) {
                    const convers = await ConversationEntity.create()
                    convers.isGroupChat = dto.isGroupChat;
                    convers.title = dto.title;
                    convers.channelId = value.accountId;
                    convers.createdBy = dto.createdBy;
                    convers.creatorId = value.groupChatID;
                    convers.updatedOn = new Date();
                    convers.updatedBy = dto.updatedBy;
                    convers.creatorName = dto.creatorName;
                    convers.channelName = dto.channelName;

                    groupchatConversation.push(convers);
                }

                const result = await this.save(groupchatConversation);

                //Call create MESSAGE end point
                return;

            }
        } else {
            //update

            if (dto.isGroupChat) {
               var result = await ConversationEntity.update({creatorId: exist.creatorId}, {updatedOn: new Date()})
                //Call create MESSAGE end point
                return exist

            } else {
                exist.updatedOn = new Date();
                const result = await ConversationEntity.save(exist);
                //Call create MESSAGE end point
                return result
            }
           

        }

    }

    async deleteConversation(id: string) {
        await getConnection().createQueryBuilder().delete().from(ConversationEntity).where("creatorId = :id", { id }).execute()
    }

    //add to existing groupchat in conversation

}
