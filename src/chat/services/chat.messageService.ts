import { Injectable, HttpStatus } from '@nestjs/common';
//import { GroupChatRepository } from '../repository/chat.groupChatRepository';
import { MessageEntity } from '../entities/message.entity';
import { CreateMessageDto } from '../dto/create-chat.dto';
import { MessageRepository } from '../repository/chat.messageRepository';



@Injectable()
export class ChatMessageService{
    constructor(private readonly messagerepo: MessageRepository){}

    async create(dto: CreateMessageDto): Promise<CreateMessageDto> {
        return await this.messagerepo.createMessage(dto)
      }

      async findOne(id: string) {
        return await this.messagerepo.getMessagebyId(id)
      }
    
      async findGroupChatId(groupcgatid: string) {
        return await this.messagerepo.getMessageByGroupChatId(groupcgatid);
      }

      async findConversationId(conversationId: string) {
        return await this.messagerepo.getMessageByGroupChatId(conversationId);
      }
    
         
      async remove(id: string) {
        return await this.messagerepo.deletMessage(id)
      }
}