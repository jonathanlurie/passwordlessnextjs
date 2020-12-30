/**
 * Endpoint: GET /api/login?token=xxxxx
 * This endpoint is not to be used directly and is meant to to be targeted by
 * the magic link send as part of the login process.
 */


import cookie from 'cookie'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import initDB from '../../core/backend/DB'
import nc from 'next-connect'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import JWT from '../../core/backend/JWT'
import User from '../../core/backend/DB/models/User'


const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(initDB)
  .get(async (req, res) => {
    console.log('Is app in production mode? ', process.env.NODE_ENV === 'production')

    // the query parm 'token' must be present
    if (!('token' in req.query)) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.LOGIN_MISSING_TOKEN.code}`)
    }

    // the token must be valid and still fresh
    const tokenInfo = JWT.verify(req.query.token)
    if (tokenInfo.error) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.LOGIN_INVALID_TOKEN.code}`)
    }

    // the subject of the token must be 'signup'
    if (tokenInfo.data.subject !== 'login') {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.LOGIN_INVALID_TOKEN.code}`)
    }

    let username = tokenInfo.data.username

    // if the first function returns non null, the second is not called
    let user = await User.findByUsername(username)

    if (!user) {
      res.statusCode = 302
      return res.redirect(`/failedlogin?error=${ErrorCodes.USER_NOT_EXISTING.code}`)
    }
    
    // we can now take the username and email from the BD
    const email = user.email
    username = user.username

    // if everything is fine, a refresh token is put in the cookies.
    // as for the uniqueVisitorId, this cookie is not visible from
    // the frontend but will enable the user fetching the /api/refresh endpoint
    const refreshToken = JWT.refreshToken(username)
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refresh_token', String(refreshToken), {
        maxAge: 60 * 60 * 24 * 365, // a year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      }
    ))

    // the param 'scenario' with the value 'signup' is only so that
    // the home page can display a little baner message to welcome
    // the new visitor.
    res.statusCode = 302
    return res.redirect(`/`)
  })


export default handler