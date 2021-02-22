import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { ConversationRepository } from '../repository/chat.conversationRepository';
import { ConversationRO } from '../chat.interface'

@Injectable()
export class ChatConverationService {
  constructor(
    private readonly conversationrepo: ConversationRepository
    ){}

  async create(dto: CreateConversationDto): Promise<CreateConversationDto> {
    //do all checks and pass the conversationdto to conversation
    // check if it's groupchat b4 binding
    //the chat end point will also be here
    return await this.conversationrepo.createOrUpdateConversation(dto)
  }

  // findAll() {
  //   //create repository end point to pick all in coversation
  //   return `This action returns all chat`;
  // }

  async findOne(id: string) {
    //pick single and all related chat
    return await this.conversationrepo.getConversationById(id)
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  async remove(id: string) {
    return await this.conversationrepo.deleteConversation(id)
  }
}
