import { Module } from '@nestjs/common';
import { GroupchatService } from './groupchat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupchatController } from './groupchat.controller';
import { GroupChatRepository } from './repository/chat.groupChatRepository';

@Module({
  imports:[
    TypeOrmModule.forFeature([GroupChatRepository])
  ],
  controllers: [GroupchatController],
  providers: [GroupchatService]
})
export class GroupchatModule {}
