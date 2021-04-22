const mailgun = require('mailgun-js')

interface MailBody {
  from: string,
  to: string,
  subject: string,
  html: string
}

class MailService {

  mailer = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
  })

  sendMail(mailBody: MailBody) {
    this.mailer.messages().send(mailBody, (error) => {
      if (error) {
        throw new Error(error);
      }
    })
  } 
  
}

export default MailService;