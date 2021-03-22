import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityRepository, getConnection, getRepository, Connection } from 'typeorm';
import { MessagerRO } from 'src/chat/chat.interface'
import { CreateMessageDto } from 'src/chat/dto/create-chat.dto'
import { MessageEntity } from '../entities/message.entity';

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity>{
    //get message by Id
    async getMessagebyId(id: string) {
       const singlemessage = await this.createQueryBuilder()
        .where("message.id = :id")
        .getOne()

        return singlemessage;        
    }


    //get message by groupChatId (check if the deleteFromAll = false befoere outputting it)
    async getMessageByGroupChatId(groupchatId:string) {
        const groupChatmessage = await this
        .createQueryBuilder("message")
        .where("message.groupChatID = :groupchatId")
        .andWhere("message.deleteFromAll = false")
        .getRawMany();

        return groupChatmessage;
    }


    //get messge by conversationId (check if the deleteFromAll = false before outputting it and check if deletefromsender = false before outputting it )
    async getMessageByConversationId(conversId:string) {
        const converationMessage = await this
        .createQueryBuilder("message")
        .where("message.conversationId = :conversId")
        .andWhere("message.deleteFromAll = false")
        .getRawMany();

        return converationMessage;
    }


    // post to message (remember to check if the payload have image, text or video)

    async createMessage(dto: CreateMessageDto): Promise<CreateMessageDto> {
       // const messagerepo = getRepository(MessageEntity);
        const newmessageentity = new MessageEntity();
        const newmessage = this.merge(newmessageentity, dto);
        await this.save(newmessage);
        return newmessage;
    }

    //delete message (cant set deleteFromAll to true if the post time is above 1hr. but can always set  deletefromsender to true any time)
    async deletMessage(id: string): Promise<string> {
        const isexist = await this.findOne(id);
        if(isexist !== null){
            await this.delete(id)
            return `Message with Id: '${id}' deleted `
        }else{
            return `No message with this Id`
        }        
    }
}