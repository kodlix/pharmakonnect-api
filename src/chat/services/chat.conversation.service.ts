import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateConversationDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { ConversationRepository } from '../repository/chat.conversation.repository';
import { ConversationRO } from '../chat.interface'
import { AccountEntity } from 'src/account/entities/account.entity';
import { MessageRepository } from '../repository/chat.message.repository';

@Injectable()
export class ChatConverationService {
  constructor(
    private readonly conversationrepo: ConversationRepository, private readonly msgRepo: MessageRepository
    ){}

  async create(dto: CreateConversationDto, user: any): Promise<CreateConversationDto> {
   
    return await this.conversationrepo.createOrUpdateConversation(dto, user)
  }

  async findConversation(creatorid: string, channelid: string){
    return await this.conversationrepo.getConversationPaticipantMessage(creatorid, channelid);
  }
  async findConversationById(id: string, user: AccountEntity){
    const messages = await this.msgRepo.find({where: {conversationId: id}, order: {createdAt: 'DESC'}});

    const res = await this.conversationrepo.createQueryBuilder("q")
                    .where("q.id = :id", {id})
                    .orWhere("q.counterPartyId = :id", {id})
                    .leftJoinAndSelect("q.messages", "messages")
                    .orderBy("q.updatedOn", "DESC")
                    .addOrderBy("messages.createdAt", "ASC")
                    .getOne();

    if(messages.length > 0) {
       const msg = messages[0];
       if(!msg.read) {
        msg.read = true;
        await this.msgRepo.save(msg);
       }
    }
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
