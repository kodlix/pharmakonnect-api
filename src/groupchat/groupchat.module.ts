import { Module } from '@nestjs/common';
import { GroupchatService } from './groupchat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupchatController } from './groupchat.controller';
import { GroupChatRepository } from './repository/groupchat.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([GroupChatRepository])
  ],
  controllers: [GroupchatController],
  providers: [GroupchatService],
  exports:[GroupchatService]
})
export class GroupchatModule {}
