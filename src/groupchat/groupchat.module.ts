import { Module } from '@nestjs/common';
import { GroupchatService } from './groupchat.service';
import { GroupchatController } from './groupchat.controller';
import { ConversationRepository } from 'src/chat/repository/chat.conversation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChatRepository } from './repository/groupchat.repository';
import { AccountModule } from 'src/account/account.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([GroupChatRepository]),ChatModule
  ],
  controllers: [GroupchatController],
  providers: [ConversationRepository, GroupchatService]
})
export class GroupchatModule {}
