import nc from 'next-connect'
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
    
    if (!('username' in req.body) || !('email' in req.body)) {
      res.statusCode = 404
      return res.json({ error: 'Username and email must be provided' })
    }

    // TODO: fetch username AND email; We do it in the api/login.js instead but we should not
    // and the token sent by email should contain the two already
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
