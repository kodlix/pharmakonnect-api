import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { ConversationRepository } from '../repository/chat.conversation.repository';
import { ConversationRO } from '../chat.interface'
import { AccountEntity } from 'src/account/entities/account.entity';

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
  async findConversationById(id: string, user: AccountEntity){
    //await this.conversationrepo.findOne(id, {relations: ['messages']});

    const res = await this.conversationrepo.createQueryBuilder("q")
                    .where("q.id = :id", {id})
                    .orWhere("q.counterPartyId = :id", {id})
                    .leftJoinAndSelect("q.messages", "messages")
                    .orderBy("q.updatedOn", "DESC")
                    .addOrderBy("messages.createdAt", "ASC")
                    .getOne();
    return res;
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
