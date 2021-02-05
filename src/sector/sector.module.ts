import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorRepository } from './sector.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([SectorRepository])
  ],
  controllers: [SectorController],
  providers: [SectorService]
})
export class SectorModule {}
