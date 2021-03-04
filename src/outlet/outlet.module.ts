import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { OutletEntity } from './entity/outlet.entity';
import { OutletController } from './outlet.controller';
import { OutletRepository } from './outlet.repository';
import { OutletService } from './outlet.service';

@Module({
  imports: [TypeOrmModule.forFeature([OutletRepository]), AccountModule],
  controllers: [OutletController],
  providers: [OutletService],
})
  export class OutletModule {}
  