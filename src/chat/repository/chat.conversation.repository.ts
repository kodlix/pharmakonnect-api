import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection, Not } from 'typeorm';
import { ConversationEntity } from 'src/chat/entities/conversation.entity'
import { ConversationRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/participant.entity'
import { CreateConversationDto } from 'src/chat/dto/create-chat.dto';
import { AccountEntity } from 'src/account/entities/account.entity';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from './chat.message.repository';
import { GroupEntity } from 'src/group/entities/group.entity';
import { GroupMemberEntity } from 'src/group/entities/group-member.entity';

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
        .orWhere("participants.accountId =:id", {id})
        .leftJoinAndSelect("c.messages", "messages")
        .leftJoinAndSelect("c.participants", "participants")
        .orderBy("c.updatedOn", "DESC")
        .addOrderBy("messages.createdAt", "DESC")
        .getMany();

        // for (const s  of getConversationList){
        //     const iniinfo = await AccountEntity.findOne(s.initiatorId);
        //     const cinfo = await AccountEntity.findOne(s.counterPartyId);

        //     if(iniinfo){
        //         s.initiatorName = iniinfo.firstName && iniinfo.lastName ? `${iniinfo.firstName} ${iniinfo.lastName}` : iniinfo.organizationName;
        //         s.initiatorImage = iniinfo.profileImage ? iniinfo.profileImage : iniinfo.premisesImage;
        //     }

        //     if(cinfo){
        //         s.counterPartyName = cinfo.firstName && cinfo.lastName ? `${cinfo.firstName} ${cinfo.lastName}` : cinfo.organizationName;
        //         s.counterPartyImage = cinfo.profileImage ? cinfo.profileImage : cinfo.premisesImage;
        //     }

        // }
        
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
            let exist;
            if(!dto.isGroupChat) {
                exist = await this.findOne({where: { initiatorId: dto.initiatorId, counterPartyId: dto.counterPartyId}});
            }
            else{
                exist = await this.findOne({where: { isGroupChat:true, channelName: dto.channelName}});
            }

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
                convers.initiatorName =  user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
                convers.counterPartyName = dto.counterPartyName;
                convers.initiatorImage = dto.initiatorImage || user.profileImage || user.premisesImage;
                convers.counterPartyImage = dto.counterPartyImage;
                convers.createdAt = new Date();
                convers.groupCreationDate = dto.groupCreationDate;

                let result = await ConversationEntity.save(convers);
                //Call create MESSAGE end point

                result = await ConversationEntity.findOne(result.id, {relations: ['messages']});

                const msg = new MessageEntity();
                msg.conversationId = result.id;
                msg.message = dto.message;
                msg.postedOn = new Date();
                msg.createdAt = new Date();
                msg.createdBy = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
                msg.senderId = user.id;
                msg.recieverId = dto.counterPartyId;

                await this.msgRepo.save(msg);

                return result;
            } else {

                const groupParticipantsFromUi = [];

                const conversadmin = await ConversationEntity.create()
                conversadmin.isGroupChat = dto.isGroupChat;
                conversadmin.title = dto.title;
                conversadmin.channelId = dto.channelId;
                conversadmin.createdBy = dto.creatorName;
                conversadmin.creatorId = dto.creatorId;
                conversadmin.updatedOn = new Date();
                conversadmin.updatedBy = dto.creatorName;
                conversadmin.creatorName = dto.creatorName;
                conversadmin.channelName = dto.channelName;
                conversadmin.channelLogo = dto.channelLogo;
                conversadmin.initiatorId = user.id;
                conversadmin.initiatorName =  user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
        

                let resp = await ConversationEntity.save(conversadmin);

                //Call create MESSAGE end point

                for (const m of dto.groupMembers){
                    let obj = {
                        conversationId: resp.id,
                        groupChatID: dto.channelId,
                        accountId: m.id,
                        accountName: m.firstName ? `${m.firstName} ${m.lastName}` : m.organizationName,
                        accountImage: m.profileImage ? m.profileImage : m.premisesImage,
                        accountType: m.accountType,
                        createdAt:  new Date(),
                        createdBy: dto.creatorName
                    }

                    groupParticipantsFromUi.push(obj);
                    obj = {} as any;
                }

                await ParticipantEntity.save(groupParticipantsFromUi);
            
                const msg = new MessageEntity();
                msg.conversationId = resp.id;
                msg.message = dto.message;
                msg.postedOn = new Date();
                msg.createdAt = new Date();
                msg.createdBy = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
                msg.senderId = user.id;
                msg.groupChatID = dto.channelId;
                
                await this.msgRepo.save(msg);

              resp = await ConversationEntity.findOne(resp.id, {relations: ['messages', 'participants']});

                //Call create MESSAGE end point
                return resp;

            }
        } else {
            //update

            if (dto.isGroupChat) {

                exist.updatedOn = new Date();
                

                let resp = await ConversationEntity.save(exist);

                resp = await ConversationEntity.findOne(resp.id, {relations: ['messages', 'participants']});
                //Call create MESSAGE end point

                const msg = new MessageEntity();
                msg.conversationId = resp.id;
                msg.message = dto.message;
                msg.postedOn = new Date();
                msg.createdAt = new Date();
                msg.createdBy = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
                msg.senderId = user.id;
                msg.groupChatID = dto.channelId;
                
                await this.msgRepo.save(msg);

        
                //Call create MESSAGE end point
                return resp;


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
                msg.createdBy = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.organizationName;
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
