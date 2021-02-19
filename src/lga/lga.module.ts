import { Module } from '@nestjs/common';
import { LgaService } from './lga.service';
import { LgaController } from './lga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LgaEntity } from './entities/lga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LgaEntity])],
  controllers: [LgaController],
  providers: [LgaService],
  exports: [LgaService]
})
export class LgaModule {}
