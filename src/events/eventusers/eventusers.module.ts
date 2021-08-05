import { Module } from '@nestjs/common';
import { EventusersService } from './eventusers.service';
import { EventusersController } from './eventusers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventUsersRepository } from './eventusers.repository';
import { AccountModule } from 'src/account/account.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([EventUsersRepository]), AccountModule
  ],
  controllers: [EventusersController],
  providers: [EventusersService]
})
export class EventUsersModule {}
