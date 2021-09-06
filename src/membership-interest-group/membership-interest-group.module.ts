import { Module } from '@nestjs/common';
import { MembershipInterestGroupService } from './membership-interest-group.service';
import { MembershipInterestGroupController } from './membership-interest-group.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipInterestGroupEntity } from './entities/membership-interest-group.entity';


@Module({
  imports: [TypeOrmModule.forFeature([MembershipInterestGroupEntity]), 
     AccountModule
  ],
  controllers: [MembershipInterestGroupController],
  providers: [MembershipInterestGroupService]
})
export class MembershipInterestGroupModule {}
