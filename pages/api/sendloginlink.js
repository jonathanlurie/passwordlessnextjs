import nc from 'next-connect'
import JWT from '../../core/backend/JWT'
import apiLimiter from '../../core/backend/apiLimiter'
import initDB from '../../core/backend/DB'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import Email from '../../core/backend/Email'
import User from '../../core/backend/DB/models/User'


/**
 * Endpoint: POST /api/sendloginlink with body 'email' and 'username' (JSON encoded)
 * In charge of sending a signup email that contains a link
 * where the url param 'token' is a magic link to register.
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(initDB)
  .post(async (req, res) => {
    const emailOrUsername = req.body.emailorusername

    // at least one of the two is required
    if (!emailOrUsername) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.CREDENTIALS_NOT_PROVIDED.code}`)
    }

    // if the first function returns non null, the second is not called
    let user = null
    if (emailOrUsername.includes('@')) {
      user = await User.findByEmail(emailOrUsername)
    } else {
      user = await User.findByUsername(emailOrUsername)
    }
    // let user = emailOrUsername.includes('@') ? (await User.findByEmail(emailOrUsername)) : (await User.findByUsername(emailOrUsername))
    if (!user) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.USER_NOT_EXISTING.code}`)
    }
    
    // we can now take the username and email from the BD
    const email = user.email
    const username = user.username
    
    const magicLinkToken = JWT.loginMagicLink(username)
    const loginUrl = `${process.env.APP_URL}/api/login?token=${magicLinkToken}`
    console.log('loginUrl: ', loginUrl)
    
    try {
      await Email.sendLoginLink(email, loginUrl, username)
      console.log('The email was sent.')
    } catch (e) {
      console.log(e)
      res.statusCode = 503
      return res.json({ error: 'Unable to send the email.' })
    }
    

    res.statusCode = 200
    return res.json({ error: null })
  })


export default handler
