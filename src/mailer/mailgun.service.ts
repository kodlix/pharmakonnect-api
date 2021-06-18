import { Injectable, Logger } from '@nestjs/common';
const mailgun = require("mailgun-js");

@Injectable()
export class MailGunService {
  API_key =  "228f80d88f5aa544cf6e9cedd0ace19f-6ae2ecad-92838f8e";
  DOMAIN =  "https://api.mailgun.net/v3/sandbox473fdcec8c9646e5a03622f50f53abf4.mailgun.org";
  private readonly mg: any;

  constructor() {
  this.mg = mailgun({apiKey: this.API_key, domain: this.DOMAIN});
  }

  async sendMailAsync(to: string, subject: string, plainText: string): Promise<void> {
    const mailchimp = require("@mailchimp/mailchimp_transactional")(
      "e09273d5491a92020b8c84b1683f552e-us6"
    );
    
    const message = {
      from_email: "hello@example.com",
      subject: "Hello world",
      text: "Welcome to Mailchimp Transactional!",
      to: [
        {
          email: "chikajohnson@gmail.com",
          type: "to"
        }
      ]
    };
    
    async function run() {
      const response = await mailchimp.messages.send({
        message
      });
      console.log(response);
    }
    run();
    //   const data = {
    //   from: 'Excited User <me@samples.mailgun.org>',
    //   to: to,
    //   subject: subject,
    //   text: plainText
    // };

    // this.mg.messages().send(data, function (error, body) {
    //   console.log(body);
    // });
  }

  async sendHtmlMailAsync(to: string, subject: string, htmlText: string): Promise<void> {
   
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: 'chikajohnson@gmail.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!'
    };

    this.mg.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
}
