/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobVacancyRepository } from './jobvacancy.repository';
import { JobVacancyController } from './jobvacancy.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([JobVacancyRepository])
  ],
  controllers: [JobVacancyController],
  providers: [JobVacancyService]
})
export class JobVacancyModule {}
