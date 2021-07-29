import { Module } from '@nestjs/common';
import { MailGunService } from './mailgun.service';
import { NodeMailerService } from './node-mailer.service';
import { SendGridService } from './sendgrid.service';

@Module({
  providers: [SendGridService, MailGunService, NodeMailerService],
  exports: [SendGridService, MailGunService, NodeMailerService],
})
export class MailerModule {}
