import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import {PackageController } from './package.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageEntity } from './entities/package.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PackageEntity]), 
     AccountModule
  ],
  controllers: [PackageController],
  providers: [PackageService]
})
export class PackageModule {}
