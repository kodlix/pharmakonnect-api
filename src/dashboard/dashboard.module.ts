import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { GroupController } from './dashboard.controller';
import { GroupService } from './dashboard.service';

@Module({
  imports:[AccountModule],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
