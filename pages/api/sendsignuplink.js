import nc from 'next-connect'
import JWT from '../../core/backend/JWT'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import initDB from '../../core/backend/DB'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import Email from '../../core/backend/Email'
import User from '../../core/backend/DB/models/User'
import Tools from '../../core/fullstack/Tools'
import { Tooltip } from 'antd'


/**
 * Endpoint: POST /api/sendsignuplink with body 'email' and 'username' (JSON encoded)
 * In charge of sending a signup email that contains a link
 * where the url param 'token' is a magic link to register.
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(initDB)
  .post(async (req, res) => {
    
    if (!('username' in req.body) || !('email' in req.body)) {
      res.statusCode = 404
      return res.json({ error: ErrorCodes.CREDENTIALS_NOT_PROVIDED.code })
    }

    const username = req.body.username
    const email = req.body.email

    if (!Tools.isUsername(username)) {
      res.statusCode = 417
      return res.json({ error: ErrorCodes.INVALID_ENTRY.code })
    }

    if (!Tools.isEmail(email)) {
      res.statusCode = 417
      return res.json({ error: ErrorCodes.INVALID_ENTRY.code })
    }

    // the email and username cannot be already taken
    if (await User.findByEmail(email)) {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.EMAIL_ALREADY_EXISTS.code })
    }

    if (await User.findByUsername(username)) {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.USERNAME_ALREADY_EXISTS.code })
    }

    const magicLinkToken = JWT.signupMagicLink(email, username)
    const signupUrl = `${process.env.APP_URL}/api/signup?token=${magicLinkToken}`
    console.log('signupUrl: ', signupUrl)
    
    try {
      await Email.sendSignupLink(email, signupUrl, req.body.username)
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
