import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import {SchoolController } from './school.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from './entities/school.entity';


@Module({
  imports: [TypeOrmModule.forFeature([SchoolEntity]), 
     AccountModule
  ],
  controllers: [SchoolController],
  providers: [SchoolService]
})
export class SchoolModule {}
