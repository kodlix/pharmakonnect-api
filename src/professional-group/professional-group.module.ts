import { Module } from '@nestjs/common';
import { ProfessionalGroupService } from './professional-group.service';
import { ProfessionalGroupController } from './professional-group.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalGroupEntity } from './entities/professional-group.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalGroupEntity]), 
     AccountModule
  ],
  controllers: [ProfessionalGroupController],
  providers: [ProfessionalGroupService]
})
export class ProfessionalGroupModule {}