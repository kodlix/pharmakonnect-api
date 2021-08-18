import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleRepository } from './module.repository';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleRepository]), AccountModule
  ],
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class ModuleModule {}
