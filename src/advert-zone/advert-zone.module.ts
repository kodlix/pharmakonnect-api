import { Module } from '@nestjs/common';
import { AdvertZoneService } from './advert-zone.service';
import {AdvertZoneController } from './advert-zone.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertZoneEntity } from './entities/advert-zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertZoneEntity]), 
     AccountModule
  ],
  controllers: [AdvertZoneController],
  providers: [AdvertZoneService],
  exports: [AdvertZoneService]
})
export class AdvertZoneModule {}
