import { Injectable, HttpStatus } from '@nestjs/common';
import { GroupChatRepository } from '../repository/chat.groupChatRepository';
import { GroupChatEntity } from '../entities/chat.groupChat';
import { CreateGroupChatDto } from '../dto/create-chat.dto';



@Injectable()
export class ChatGroupChatService{
    constructor(private readonly groupchatrepo: GroupChatRepository){}

    async create(dto: GroupChatEntity): Promise<GroupChatEntity> {
        return await this.groupchatrepo.createGroup(dto)
      }

      async findOne(id: string) {
        return await this.groupchatrepo.getGroupChatById(id)
      }
    
      async findAll() {
        return await this.groupchatrepo.getAllGroupChat();
      }
    
      async update(id: string, dto: GroupChatEntity) {
        return await this.groupchatrepo.updateGroupChat(id, dto)
      }
    
      async remove(id: string) {
        return await this.groupchatrepo.deleteGroupChat(id)
      }
}