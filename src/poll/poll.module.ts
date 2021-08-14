import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollRepository } from './repositories/poll.repository';
import { AccountModule } from 'src/account/account.module';
import { PollVoteRepository } from './repositories/poll-vote.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PollRepository, PollVoteRepository]), AccountModule],
  controllers: [PollController],
  providers: [PollService]
})
export class PollModule {}
