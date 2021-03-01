/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorModule } from './sector/sector.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';
import { JobVacancyModule } from './jobvacancy/jobvacancy.module';
import { LgaModule } from './lga/lga.module';
import { SeederModule } from './seeder/seeder.module';
import { ScheduleMeetingsModule } from './video-conferencing/schedule-meetings/schedule-meetings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    SectorModule,
    CountryModule,
    StateModule,
    JobVacancyModule,
    LgaModule,
    SeederModule,
    ScheduleMeetingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
