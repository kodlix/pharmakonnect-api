import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { ConversationEntity } from 'src/chat/entities/conversation.entity'
import { ConversationRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/participant.entity'
import { CreateConversationDto } from 'src/chat/dto/create-chat.dto';
import { AccountEntity } from 'src/account/entities/account.entity';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from './chat.message.repository';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity>{

    constructor(private readonly msgRepo: MessageRepository) {
        super();
    }

    async getConversationById(id: any): Promise<ConversationRO[]> {
        // const getConversationList = await ConversationEntity.find({
        //     where: [{ initiatorId: id }, { counterPartyId: id }], order: {updatedOn: 'ASC'}, relations: ['messages']
        // })
        
        const getConversationList = await ConversationEntity.createQueryBuilder("c")
        .where("c.initiatorId = :id", {id})
        .orWhere("c.counterPartyId = :id", {id})
        .leftJoinAndSelect("c.messages", "messages")
        .orderBy("c.updatedOn", "DESC")
        .addOrderBy("messages.createdAt", "DESC")
        .getMany();
        
        return getConversationList;
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

    async createOrUpdateConversation(dto: CreateConversationDto, user: AccountEntity): Promise<CreateConversationDto> {

        try {
            const exist = await this.findOne({where: { initiatorId: dto.initiatorId, counterPartyId: dto.counterPartyId}})
        if (!exist) {

            if (!dto.isGroupChat) {

                const convers = await ConversationEntity.create()
                convers.isGroupChat = dto.isGroupChat;
                convers.title = dto.title;
                convers.channelId = dto.channelId;
                convers.createdBy = user.createdBy;
                convers.creatorId = dto.creatorId;
                convers.updatedOn = new Date();
                convers.updatedBy = dto.updatedBy;
                convers.channelName = dto.channelName;
                convers.creatorName = dto.creatorName;
                convers.initiatorId = user.id;
                convers.counterPartyId = dto.counterPartyId;
                convers.initiatorName = `${user.firstName} ${user.lastName}`;
                convers.counterPartyName = dto.counterPartyName;
                convers.initiatorImage = dto.initiatorImage;
                convers.counterPartyImage = dto.counterPartyImage;
                convers.createdAt = new Date();

                let result = await ConversationEntity.save(convers);
                //Call create MESSAGE end point

                result = await ConversationEntity.findOne(result.id, {relations: ['messages']});

                const msg = new MessageEntity();
                msg.conversationId = result.id;
                msg.message = dto.message;
                msg.postedOn = new Date();
                msg.createdAt = new Date();
                msg.createdBy = `${user.firstName} ${user.lastName}`;
                msg.senderId = user.id;
                msg.recieverId = dto.counterPartyId;

                await this.msgRepo.save(msg);

                return result;
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
                return exist;

            } else {
                exist.updatedOn = new Date();
                let result = await ConversationEntity.save(exist);
                //Call create MESSAGE end point

                result = await ConversationEntity.findOne(result.id, {relations: ['messages']});

                const msg = new MessageEntity();
                msg.conversationId = result.id;
                msg.message = dto.message;
                msg.postedOn = new Date();
                msg.createdAt = new Date();
                msg.createdBy = `${user.firstName} ${user.lastName}`;
                msg.senderId = user.id;
                msg.recieverId = dto.counterPartyId;

                await this.msgRepo.save(msg);
                return result;
            }
        }
    
        } catch (error) {
            throw new HttpException(`Error occured: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    async deleteConversation(id: string) {
        await getConnection().createQueryBuilder().delete().from(ConversationEntity).where("creatorId = :id", { id }).execute()
    }

    //add to existing groupchat in conversation

}
