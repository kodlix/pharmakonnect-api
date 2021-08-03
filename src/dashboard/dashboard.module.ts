import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports:[AccountModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
