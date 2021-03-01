import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { ConversationEntity } from 'src/chat/entities/conversation.entity'
import { ConversationRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/participant.entity'
import { CreateConversationDto } from 'src/chat/dto/create-chat.dto';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity>{

    async getConversationById(id: string): Promise<ConversationRO[]> {
        return await ConversationEntity.find({
            where: [{ creatorId: id },
            { channelId: id }]
        })
    }

    async createOrUpdateConversation(dto: CreateConversationDto): Promise<CreateConversationDto> {

        const exist = await this.findOne({
            where: [{ creatorId: dto.creatorId, channelId: dto.channelId }, { creatorId: dto.channelId, channelId: dto.creatorId }]
        })
        if (!exist) {


            if (!dto.isGroupChat) {
                const convers = await ConversationEntity.create()
                convers.isGroupChat = dto.isGroupChat;
                convers.title = dto.title;
                convers.channelId = dto.channelId;
                convers.createdBy = dto.createdBy;
                convers.creatorId = dto.creatorId;
                convers.updatedOn = new Date();
                convers.updatedBy = dto.updatedBy;

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

                    groupchatConversation.push(convers);
                }

                const result = await this.save(groupchatConversation);

                //Call create MESSAGE end point
                return;

            }
        } else {
            //update

            if (dto.isGroupChat) {
                await ConversationEntity.update({creatorId: exist.creatorId}, {updatedOn: new Date()})
                const result = await ConversationEntity.save(exist);
                //Call create MESSAGE end point
                return result

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
