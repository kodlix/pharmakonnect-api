import { Module } from '@nestjs/common';
import { OrganizationCategoryService } from './organization-category.service';
import {OrganizationCategoryController } from './organization-category.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationCategoryEntity } from './entities/organization-category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([OrganizationCategoryEntity]), 
     AccountModule
  ],
  controllers: [OrganizationCategoryController],
  providers: [OrganizationCategoryService]
})
export class OrganizationCategoryModule {}
