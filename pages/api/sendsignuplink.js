import nc from 'next-connect'
import JWT from '../../core/backend/JWT'
import apiLimiter from '../../core/backend/ApiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import DB from '../../core/DB'
import ErrorCodes from '../../core/fullstack/ErrorCodes'


/**
 * Endpoint: POST /api/sendsignuplink with body 'email' and 'username' (JSON encoded)
 * In charge of sending a signup email that contains a link
 * where the url param 'token' is a magic link to register.
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .post(async (req, res) => {
    
    if (!('username' in req.body) || !('email' in req.body)) {
      res.statusCode = 404
      return res.json({ error: ErrorCodes.CREDENTIALS_NOT_PROVIDED })
    }

    const username = req.body.username
    const email = req.body.email

    // the email and username cannot be already taken
    if (DB.hasUserFromEmail(email)) {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.EMAIL_ALREADY_EXISTS })
    }

    if (DB.hasUserFromUsername(username)) {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.USERNAME_ALREADY_EXISTS })
    }

    const magicLinkToken = JWT.signupMagicLink(req.body.email, req.body.username)
    const signupUrl = `${process.env.APP_URL}/api/signup?token=${magicLinkToken}`
    console.log('signupUrl: ', signupUrl)
    
    // try {
    //   await Email.sendSignupLink(email, signupUrl, req.body.username)
    // } catch (e) {
    //   res.statusCode = 503
    //   return res.json({ error: 'Unable to send the email.' })
    // }
    

    res.statusCode = 200
    return res.json({ error: null })
  })


export default handler
