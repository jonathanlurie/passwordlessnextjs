const sgMail = require('@sendgrid/mail')
const mailgun = require("mailgun-js");

sgMail.setApiKey('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')



async function sendgridSend() {
  const msg = {
    to: 'lurie.jo+test@gmail.com',
    from: 'jojo@jnth.io', // Use the email address or domain you verified above
    subject: 'Un test d\'envoie de message depuis sendgrid jnth',
    text: 'Bonjour, voila un message en format text',
    html: 'Bonjour, voici un message en format html <strong>avec du texte en gras.</strong>123',
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

sendgridSend()
