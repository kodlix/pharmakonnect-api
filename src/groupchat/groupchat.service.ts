import { Injectable, HttpStatus } from '@nestjs/common';
import { GroupChatRepository } from './repository/chat.groupChatRepository';
import { GroupChatEntity } from './entities/groupChat.entity';
import { CreateGroupChatDto } from './dto/create-groupchat.dto';
import { UpdateGroupchatDto } from './dto/update-groupchat.dto';



@Injectable() 
export class GroupchatService{
    constructor(private readonly groupchatrepo: GroupChatRepository){}

    async create(dto: CreateGroupChatDto): Promise<CreateGroupChatDto> {
        return await this.groupchatrepo.createGroup(dto)
      }

      async findOne(id: string) {
        return await this.groupchatrepo.getGroupChatById(id)
      }
    
      async findAll() {
        return await this.groupchatrepo.getAllGroupChat();
      }
    
      async update(id: string, dto: UpdateGroupchatDto) {
        return await this.groupchatrepo.updateGroupChat(id, dto)
      }
    
      async remove(id: string) {
        return await this.groupchatrepo.deleteGroupChat(id)
      }
}