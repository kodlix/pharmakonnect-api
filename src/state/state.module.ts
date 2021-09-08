import { forwardRef, Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateEntity } from './entities/state.entity';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity]), forwardRef(() => AccountModule)],
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService]
})
export class StateModule {}
