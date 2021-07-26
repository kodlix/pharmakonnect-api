/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobVacancyService } from './jobvacancy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobVacancyRepository } from './jobvacancy.repository';
import { JobVacancyController } from './jobvacancy.controller';
import { AccountModule } from 'src/account/account.module';
import { JobSubscriber } from 'src/_common/subscribers/job.subscriber';
import { NotificationGateway } from 'src/gateway/notification.gateway';

@Module({
  imports:[
    TypeOrmModule.forFeature([JobVacancyRepository]),
    AccountModule
  ],
  controllers: [JobVacancyController],
  providers: [JobVacancyService, JobSubscriber, NotificationGateway]
})
export class JobVacancyModule {}
