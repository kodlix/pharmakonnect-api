import { Module } from '@nestjs/common';
import { AdvertZoneService } from './advert-zone.service';
import {AdvertZoneController } from './advert-zone.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
     AccountModule
  ],
  controllers: [AdvertZoneController],
  providers: [AdvertZoneService]
})
export class AdvertZoneModule {}
