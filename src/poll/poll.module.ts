import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollRepository } from './repositories/poll.repository';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([PollRepository]), AccountModule],
  controllers: [PollController],
  providers: [PollService]
})
export class PollModule {}
