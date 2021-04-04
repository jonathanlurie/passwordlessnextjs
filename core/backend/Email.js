const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


export default class Email {

  static async sendEmail(to, options = {}) {
    const msg = {
      to,
      from: 'from' in options ? options.from : `${process.env.PRODUCT_NAME} <${process.env.DEFAULT_EMAIL_SENDER}>`,
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

    await Email.sendEmail(to,
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

    await Email.sendEmail(to,
      {
        subject: `Login to ${process.env.PRODUCT_NAME}`,
        text: `Hello,\nfollow this link to connect to ${process.env.PRODUCT_NAME}:\n${linkUrl}\nBest,\nThe ${process.env.PRODUCT_NAME} team.`,
        html,
      })
  }


  static async sendUpdateEmailLink(to, updatedEmail, updatEmailUrl, username) {
    const html = `
      <div>
        <p>
          Hello ${username},
        </p>
        <p>
          you have required to update your email address on ${process.env.PRODUCT_NAME} to be <b>${updatedEmail}</b>. Please click on the link below to confirm.
        </p>
        <p>
          <a href="${updatEmailUrl}">Update to ${updatedEmail}</a>
        </p>
        <p>
          Best,<br>
          The ${process.env.PRODUCT_NAME} team.
        </p>
      </div>
    `

    await Email.sendEmail(to,
      {
        subject: `Email update confirmation to ${process.env.PRODUCT_NAME}`,
        text: `Hello,\nyou have required to update your email address on ${process.env.PRODUCT_NAME} to be ${updatedEmail}. Please follow this link to confirm:\n${updatEmailUrl}\nBest,\nThe ${process.env.PRODUCT_NAME} team.`,
        html,
      })
  }
}