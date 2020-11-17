import nc from 'next-connect'
import DB from '../../core/backend/DB'
import JWT from '../../core/backend/JWT'
import apiLimiter from '../../core/backend/ApiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'


/**
 * Endpoint: POST /api/sendloginlink with body 'email' and 'username' (JSON encoded)
 * In charge of sending a signup email that contains a link
 * where the url param 'token' is a magic link to register.
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .post(async (req, res) => {
    const emailOrUsername = req.body.emailorusername

    // at least one of the two is required
    if (!emailOrUsername) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.CREDENTIALS_NOT_PROVIDED.code}`)
    }
    console.log('DEBUG01')
    // if the first function returns non null, the second is not called
    let user = DB.getUserFromEmail(emailOrUsername) || DB.getUserFromUsername(emailOrUsername)
    console.log('DEBUG02')
    if (!user) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.USER_NOT_EXISTING.code}`)
    }
    
    // we can now take the username and email from the BD
    const email = user.email
    const username = user.username
    
    const magicLinkToken = JWT.loginMagicLink(email, username)
    const loginUrl = `${process.env.APP_URL}/api/login?token=${magicLinkToken}`
    console.log('loginUrl: ', loginUrl)
    
    // try {
    //   await Email.sendLoginLink(email, loginUrl, username)
    // } catch (e) {
    //   res.statusCode = 503
    //   return res.json({ error: 'Unable to send the email.' })
    // }
    

    res.statusCode = 200
    return res.json({ error: null })
  })


export default handler