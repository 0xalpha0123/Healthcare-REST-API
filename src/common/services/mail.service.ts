import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mailgun from 'mailgun-js';

interface MailBody {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private mailer;
  constructor(private readonly configService: ConfigService) {
    const mailgunConfig = this.configService.get('mailgun');
    this.mailer = mailgun(mailgunConfig);
  }

  sendMail(mailBody: MailBody) {
    this.mailer.messages().send(mailBody, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}
