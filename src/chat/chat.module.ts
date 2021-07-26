import { Module } from '@nestjs/common';
import { ChatConverationService } from './services/chat.conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ChatGroupChatService } from './services/chat.groupChatService';
import { ChatController } from './chat.controller';
import { AlertGateway } from './chat.chatservice';
import { ChatMessageService } from './services/chat.message.service';
import { ConversationRepository} from './repository/chat.conversation.repository'
//import { GroupChatRepository } from './repository/chat.groupChatRepository';
import { MessageRepository } from './repository/chat.message.repository';
import { ParticipantEntity } from './entities/participant.entity';
import { AccountModule } from 'src/account/account.module';
import { ChatGateway } from 'src/gateway/chat.gateway';

@Module({
  imports:[
    TypeOrmModule.forFeature([ConversationRepository, MessageRepository, ParticipantEntity]),
    AccountModule
  ],
  controllers: [ChatController],
  providers: [ChatConverationService, ChatGateway, AlertGateway, ChatMessageService]
})
export class ChatModule {}
