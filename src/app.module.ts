import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    SectorModule,
    ChatModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
