import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import {SchoolController } from './school.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
     AccountModule
  ],
  controllers: [SchoolController],
  providers: [SchoolService]
})
export class SchoolModule {}
