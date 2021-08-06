import { forwardRef, Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { ContactModule } from 'src/contact/contact.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports:[AccountModule,  forwardRef(() =>ContactModule)],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {}
