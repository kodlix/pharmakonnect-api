import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorRepository } from './sector.repository';
import { Repository } from 'typeorm';
import { SectorEntity } from './entities/sector.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([SectorRepository])
  ],
  controllers: [SectorController],
  providers: [SectorService]
})
export class SectorModule {}
