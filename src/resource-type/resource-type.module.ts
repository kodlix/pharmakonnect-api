import { Module } from '@nestjs/common';
import { ResourceTypeService } from './resource-type.service';
import { ResourceTypeController } from './resource-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceTypeRepository } from './resource-type.repository';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceTypeRepository]), AccountModule
  ],
  controllers: [ResourceTypeController],
  providers: [ResourceTypeService]
})
export class ResourceTypeModule {}
