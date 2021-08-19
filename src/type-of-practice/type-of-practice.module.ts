import { Module } from '@nestjs/common';
import { TypeOfPracticeService } from './type-of-practice.service';
import {TypeOfPracticeController } from './type-of-practice.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfPracticeEntity } from './entities/type-of-practice.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TypeOfPracticeEntity]),
     AccountModule
  ],
  controllers: [TypeOfPracticeController],
  providers: [TypeOfPracticeService]
})
export class TypeOfPracticeModule {}
