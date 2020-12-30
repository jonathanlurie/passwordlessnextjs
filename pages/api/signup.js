/**
 * Endpoint: GET /api/signup?token=xxxxx
 * This endpoint is not to be used directly and is meant to to be targeted by
 * the magic link send as part of the signup process.
 */


import cookie from 'cookie'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import nc from 'next-connect'
import initDB from '../../core/backend/DB'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import JWT from '../../core/backend/JWT'
import User from '../../core/backend/DB/models/User'


const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(initDB)
  .get(async (req, res) => {

    // the query parm 'token' must be present
    if (!('token' in req.query)) {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SIGNUP_MISSING_TOKEN.code}`)
    }

    // the token must be valid and still fresh
    const tokenInfo = JWT.verify(req.query.token)
    if (tokenInfo.error) {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SIGNUP_INVALID_TOKEN.code}`)
    }

    // the subject of the token must be 'signup'
    if (tokenInfo.data.subject !== 'signup') {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SIGNUP_INVALID_TOKEN.code}`)
    }

    const email = tokenInfo.data.email
    const username = tokenInfo.data.username

    // the DB registration will check if the user already exists.
    // This could be the case if the user has already used this token
    try {
      const user = new User({email, username})
      await user.save()
    } catch (e) { // e is of type ErrorWithCode
      console.log(e)
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${e.code}`)
    }

    // if everything is fine, a refresh token is put in the cookies.
    // as for the uniqueVisitorId, this cookie is not visible from
    // the frontend.
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
