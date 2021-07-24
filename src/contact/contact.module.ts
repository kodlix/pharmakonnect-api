import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports:[AccountModule, TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
