import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

const mailgun = require('mailgun-js')

interface MailBody {
  from: string,
  to: string,
  subject: string,
  html: string
}
@Injectable()
class MailService {
  private mailer;
  constructor(private readonly configService: ConfigService) {
    const mailgunConfig = this.configService.get('mailgun');
    this.mailer = mailgun(mailgunConfig)
  }

  sendMail(mailBody: MailBody) {
    this.mailer.messages().send(mailBody, (error) => {
      if (error) {
        console.log(error);
      }
    })
  } 
  
}

export default MailService;