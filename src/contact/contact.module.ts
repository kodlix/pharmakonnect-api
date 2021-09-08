import { forwardRef, Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './entities/contact.entity';
import { AccountModule } from 'src/account/account.module';
import { GroupModule } from 'src/group/group.module';
import { StateModule } from 'src/state/state.module';
import { CountryModule } from 'src/country/country.module';
import { LgaModule } from 'src/lga/lga.module';

@Module({
  imports:[
    forwardRef(() => GroupModule), 
    forwardRef(() =>AccountModule), 
    forwardRef(() =>StateModule), 
    forwardRef(() =>CountryModule), 
    forwardRef(() =>LgaModule), 
    TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService]
})
export class ContactModule {}
