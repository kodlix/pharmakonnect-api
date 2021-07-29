import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class NodeMailerService {
  private readonly transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'mail.netopconsulting.com',
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: 'netopdev@netopconsulting.com',
        pass: '!Pass4sure',
      },
      logger: true
    });
  }


  async sendHtmlMailAsync(to: string, subject: string, htmlText: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: '"Kapsuul" <netopdev@netopconsulting.com>',
        to: to,
        subject: subject,
        text: htmlText,
        html: htmlText,
        headers: { 'x-myheader': 'test header' }
      });
    } catch (error) {
      console.log(error);      
      Logger.error(`NODE-MAILER.sendHtmlMailAsync: ${error.toString()}`);
    }
  }
}
