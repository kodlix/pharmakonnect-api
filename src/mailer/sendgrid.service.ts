import { Injectable, Logger } from '@nestjs/common';
import  * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
      SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendMailAsync(to: string, subject: string, plainText: string): Promise<void> {
    if (!process.env.SENDGRID_FROM_EMAIL) {
      return;
    }

    try {
      await SendGrid.send({
        from: process.env.SENDGRID_FROM_EMAIL,
        to,
        subject,
        text: plainText,
      });
    } catch (error) {
      Logger.error(`SendGridService.sendMailAsync: ${error.toString()}`);
    }
  }

  async sendHtmlMailAsync(to: string, subject: string, htmlText: string): Promise<void> {
    if (!process.env.SENDGRID_FROM_EMAIL) {
      return;
    }

    try {
      await SendGrid.send({
        from: process.env.SENDGRID_FROM_EMAIL,
        to,
        subject,
        html: htmlText,
      });
    } catch (error) {
      Logger.error(`SendGridService.sendHtmlMailAsync: ${error.toString()}`);
    }
  }
}
