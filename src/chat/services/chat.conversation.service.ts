import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { ConversationRepository } from '../repository/chat.conversation.repository';
import { ConversationRO } from '../chat.interface'

@Injectable()
export class ChatConverationService {
  constructor(
    private readonly conversationrepo: ConversationRepository
    ){}

  async create(dto: CreateConversationDto, user: any): Promise<CreateConversationDto> {
   
    return await this.conversationrepo.createOrUpdateConversation(dto, user)
  }

  async findConversation(creatorid: string, channelid: string){
    return await this.conversationrepo.getConversationPaticipantMessage(creatorid, channelid);
  }

  // findAll() {
  //   //create repository end point to pick all in coversation
  //   return `This action returns all chat`;
  // }

  async findOne(user: any) {
    //pick single and all related chat
    return await this.conversationrepo.getConversationById(user)
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  async remove(id: string) {
    return await this.conversationrepo.deleteConversation(id)
  }
}
