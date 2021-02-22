import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { ConversationEntity } from 'src/chat/entities/chat.conversation'
import { ConversationRO } from 'src/chat/chat.interface'
import { ParticipantEntity } from 'src/chat/entities/chat.participant'
import { CreateConversationDto } from 'src/chat/dto/create-chat.dto';

@EntityRepository(ConversationEntity)
export class ConversationRepository extends Repository<ConversationEntity>{     

    async getConversationById(id: string): Promise<ConversationRO[]> {
        return await ConversationEntity.find({where:[{ creatorId : id},
        { channelId : id}]
        })
    }

    async createOrUpdateConversation(dto: CreateConversationDto): Promise<CreateConversationDto> {

        const exist = await ConversationEntity.findOne({
            select:["id"], 
            where:[{creatorId: dto.creatorId, channelId: dto.channelId}, {creatorId: dto.channelId, channelId: dto.creatorId}]
        })        
        if(exist){
            //create
            
            if(!dto.isGroupChat){
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
            }else{
                const getparticipant = await ParticipantEntity.find({where:{groupChatID: dto.channelId}});

                getparticipant.forEach(async function(value){
                    const convers = await ConversationEntity.create()
                convers.isGroupChat = dto.isGroupChat;
                convers.title = dto.title;
                convers.channelId = value.accountId;
                convers.createdBy = dto.createdBy;
                convers.creatorId = value.groupChatID;
                convers.updatedOn =  new Date();
                convers.updatedBy = dto.updatedBy;

                const result = await ConversationEntity.save(convers);
                })
                //Call create MESSAGE end point
                return;

            }          
        }else{
             //update
            if(!dto.isGroupChat){

                exist.updatedOn =  new Date();
                const result = await ConversationEntity.save(exist);
                //Call create MESSAGE end point
                return result
            }else{

                const result = await getConnection().createQueryBuilder().update(ConversationEntity)
                .set({
                    updatedOn :  new Date()
                }).where("creatorId = dto.channelId ").execute();

                //Call create MESSAGE end point

                return;
            }
        }      
        
    }

    async deleteConversation(id: string) {
        await getConnection().createQueryBuilder().delete().from(ConversationEntity).where("creatorId = :id").execute()
    }

    //add to existing groupchat in conversation

}
