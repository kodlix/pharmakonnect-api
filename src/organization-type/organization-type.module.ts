import { Module } from '@nestjs/common';
import { OrganizationTypeService } from './organization-type.service';
import {OrganizationTypeController } from './organization-type.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
     AccountModule
  ],
  controllers: [OrganizationTypeController],
  providers: [OrganizationTypeService]
})
export class OrganizationTypeModule {}
