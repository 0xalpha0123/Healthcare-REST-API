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
    return new Promise((resolve, reject) => {
      this.mailer.messages().send(mailBody, (error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response);
      });

    })
  }
}
