/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobVacancyRepository } from './jobvacancy.repository';
import { JobVacancyController } from './jobvacancy.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([JobVacancyRepository]),
    AccountModule
  ],
  controllers: [JobVacancyController],
  providers: [JobVacancyService]
})
export class JobVacancyModule {}
