import { forwardRef, Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity';
import { AccountModule } from 'src/account/account.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports:[AccountModule, TypeOrmModule.forFeature([ContactEntity]),  forwardRef(() => GroupModule)],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService]
})
export class ContactModule {}
