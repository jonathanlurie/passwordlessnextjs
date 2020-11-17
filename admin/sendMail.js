require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function main() {
  const msg = {
    to: 'lurie.jo@gmail.com',
    from: process.env.DEFAULT_EMAIL_SENDER,
    subject: 'Test mail subject',
    text: 'hello text 2',
    html: 'hello <b>html</b> 2',
  }

  try {
    await sgMail.send(msg)
  } catch(e) {
    console.log(e)
  }
}

main()