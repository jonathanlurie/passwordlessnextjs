import cookie from 'cookie'
import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/ApiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import nc from 'next-connect'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import JWT from '../../core/backend/JWT'

/**
 * Endpoint: /api/signup
 * To check if an email is already in the DB
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .get(async (req, res) => {

    // the query parm 'token' must be present
    if (!('token' in req.query)) {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SINUP_MISSING_TOKEN}`)
    }

    // the token must be valid and still fresh
    const tokenInfo = JWT.verify(req.query.token)
    if (tokenInfo.error) {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SIGNUP_INVALID_TOKEN}`)
    }

    // the subject of the token must be 'signup'
    if (tokenInfo.data.subject !== 'signup') {
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${ErrorCodes.SIGNUP_INVALID_TOKEN}`)
    }

    const email = tokenInfo.data.email
    const username = tokenInfo.data.username

    // the DB registration will check if the user already exists.
    // This could be the case if the user has already used this token
    try {
      await DB.createUser(email, username)
    } catch (e) { // e is of type ErrorWithCode
      console.log(e)
      res.statusCode = 302
      return res.redirect(`/failedsignup?error=${e.code}`)
    }

    // if everything is fine, a refresh token is put in the cookies.
    // as for the uniqueVisitorId, this cookie is not visible from
    // the frontend.
    const refreshToken = JWT.refreshToken(email, username)
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
    return res.redirect(`/?scenario=signup`)
  })


export default handler

// http://localhost:3030/api/signup?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijoic2lnbnVwIiwiZW1haWwiOiJ6ZXJ0QHl0cmV6LmZyIiwidXNlcm5hbWUiOiJqb2pvIiwiaWF0IjoxNjA0NzU5NjQzLCJleHAiOjE2MDQ3NjAyNDN9._p45MmiWlqBgjMuB7B0Fmt2ylixQ3jtnAAc38lDytb4