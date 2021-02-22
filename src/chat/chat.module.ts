import { Module } from '@nestjs/common';
import { ChatConverationService } from './services/chat.conversationService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroupChatService } from './services/chat.groupChatService';
import { ChatController } from './chat.controller';
import { AlertGateway } from './chat.chatservice';
import { ChatGateway } from './chat.socket'
import { ChatMessageService } from './services/chat.messageService';
import { ConversationRepository} from './repository/chat.conversationRepository'
import { GroupChatRepository } from './repository/chat.groupChatRepository';
import { MessageRepository } from './repository/chat.messageRepository';

@Module({
  imports:[
    TypeOrmModule.forFeature([ConversationRepository, GroupChatRepository, MessageRepository])
  ],
  controllers: [ChatController],
  providers: [ChatConverationService, AlertGateway, ChatGateway, ChatGroupChatService, ChatMessageService]
})
export class ChatModule {}
