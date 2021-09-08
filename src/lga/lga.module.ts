import { forwardRef, Module } from '@nestjs/common';
import { LgaService } from './lga.service';
import { LgaController } from './lga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LgaEntity } from './entities/lga.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([LgaEntity]), forwardRef(() => AccountModule)],
  controllers: [LgaController],
  providers: [LgaService],
  exports: [LgaService]
})
export class LgaModule {}
