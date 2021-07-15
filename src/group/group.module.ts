import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports:[AccountModule],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
