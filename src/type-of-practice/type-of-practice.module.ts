import { Module } from '@nestjs/common';
import { TypeOfPracticeService } from './type-of-practice.service';
import {TypeOfPracticeController } from './type-of-practice.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
     AccountModule
  ],
  controllers: [TypeOfPracticeController],
  providers: [TypeOfPracticeService]
})
export class TypeOfPracticeModule {}
