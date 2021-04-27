import t from '../../locale/pl.json';
const template = `
<div style="text-align: center; max-width:500px; margin: 20px auto; font-family:  Helvetica, Arial sans-serif;">
  <div>
    <img src="https://healthcare-industry-photos.s3.eu-west-2.amazonaws.com/static/logo.png" width="150px"/>
    <div style="margin-top: 20px;"> ${t.confirmationEmail} </div>
    <div style="margin-bottom: 20px;"> ${t.confirmationEmail2} </div>
    </div>
    <a href="{CONFIRMATION_LINK}"><button style="color: #fff; background-color: #1976d2; padding: 10px 20px; border:none; border-radius:4px;"> ${t.confirm} </button></a>
  </div>
</div>
`

export default function (verificationToken: string): string {
  const confirmationLink = `${process.env.ADMIN_FRONT_URL}/auth/${verificationToken}`
  return template.replace('{CONFIRMATION_LINK}', confirmationLink);
}