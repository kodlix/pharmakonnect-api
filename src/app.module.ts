import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    SectorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
