const template =`
<div style="text-align: center; max-width:500px; margin: 20px auto; font-family:  Helvetica, Arial sans-serif;">
  <div>
    <img src="https://healthcare-industry-photos.s3.eu-west-2.amazonaws.com/static/logo.png" width="150px"/>
    <div style="margin-top: 20px;"> Thank you for creating an account on our website. </div>
    <div style="margin-bottom: 20px;">To confirm your email address, please click the button below </div>
    </div>
    <a href="{CONFIRMATION_LINK}"><button style="color: #fff; background-color: #1976d2; padding: 10px 20px; border:none; border-radius:4px;"> Confirm </button></a>
  </div>
</div>
`

export default function (verificationToken: string):string {
  const confirmationLink = `${process.env.ADMIN_FRONT_URL}/auth/${verificationToken}`
  return template.replace('{CONFIRMATION_LINK}', confirmationLink);
}