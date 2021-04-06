import { Module } from '@nestjs/common';
import { EventtypeService } from './eventtype.service';
import { EventtypeController } from './eventtype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTypeRepository } from './eventtype.repository';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTypeRepository]), AccountModule
  ],
  controllers: [EventtypeController],
  providers: [EventtypeService]
})
export class EventTypeModule {}
