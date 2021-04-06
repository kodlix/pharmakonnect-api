import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports:[AccountModule],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
