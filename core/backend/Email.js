const sgMail = require('@sendgrid/mail')

export default class Email {

  static async sendEmail(to, options = {}) {
    const msg = {
      to,
      from: 'from' in options ? options.from : process.env.DEFAULT_EMAIL_SENDER,
      subject: 'subject' in options ? options.subject : '',
      text: 'text' in options ? options.text : '',
      html: 'html' in options ? options.html : '',
    }

    await sgMail.send(msg)
  }


  static async sendSignupLink(to, linkUrl, username) {

    const html = `
      <div>
        <p>
          Welcome onboard ${username}!
        </p>
        <p>
          you can connect to ${process.env.PRODUCT_NAME} simply by clicking <a href="${linkUrl}">here</a>.
        </p>
        <p>
          Best,<br>
          The ${process.env.PRODUCT_NAME} team.
        </p>
      </div>
    `

    await sendEmail.sendEmail(to,
      {
        subject: `Signup to ${process.env.PRODUCT_NAME}`,
        text: `Hello,\nfollow this link to connect to ${process.env.PRODUCT_NAME}:\n${linkUrl}\nBest,\nThe ${process.env.PRODUCT_NAME} team.`,
        html,
      })
  }


  static async sendLoginLink(to, linkUrl, username) {

    const html = `
      <div>
        <p>
          Hello again ${username},
        </p>
        <p>
          you can connect to ${process.env.PRODUCT_NAME} simply by clicking <a href="${linkUrl}">here</a>.
        </p>
        <p>
          Best,<br>
          The ${process.env.PRODUCT_NAME} team.
        </p>
      </div>
    `

    await sendEmail.sendEmail(to,
      {
        subject: `Login to ${process.env.PRODUCT_NAME}`,
        text: `Hello,\nfollow this link to connect to ${process.env.PRODUCT_NAME}:\n${linkUrl}\nBest,\nThe ${process.env.PRODUCT_NAME} team.`,
        html,
      })
  }
}