import { Module } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionEntity } from './entities/profession.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProfessionEntity]), 
     AccountModule
  ],
  controllers: [ProfessionController],
  providers: [ProfessionService]
})
export class ProfessionModule {}
