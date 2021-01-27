import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorEntity } from './entities/sector.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([SectorEntity])
  ],
  controllers: [SectorController],
  providers: [SectorService]
})
export class SectorModule {}
