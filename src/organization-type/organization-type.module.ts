import { Module } from '@nestjs/common';
import { OrganizationTypeService } from './organization-type.service';
import {OrganizationTypeController } from './organization-type.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationTypeEntity } from './entities/organization-type.entity';


@Module({
  imports: [TypeOrmModule.forFeature([OrganizationTypeEntity]), 
     AccountModule
  ],
  controllers: [OrganizationTypeController],
  providers: [OrganizationTypeService]
})
export class OrganizationTypeModule {}
