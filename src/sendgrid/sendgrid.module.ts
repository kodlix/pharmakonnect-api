import { Module } from '@nestjs/common';
import  SendGridService from './sendgrid.service';

@Module({
  providers: [SendGridService]
})
export class SendgridModule {}
