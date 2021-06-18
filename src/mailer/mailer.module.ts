import { Module } from '@nestjs/common';
import { MailGunService } from './mailgun.service';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [SendGridService, MailGunService],
  exports: [SendGridService, MailGunService],
})
export class MailerModule {}
