/**
 * The GET /api/refresh endpoint is used with no argument or body to get a
 * new access token but will work only if a refresh token is present in the
 * encrypted cookies.
 * If the refresh token is valid, it will also be updated. The returned payload
 * will have the following form {error: null|number, data: string}
 */

import cookie from 'cookie'
import nc from 'next-connect'
import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/ApiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import JWT from '../../core/backend/JWT'


const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .get((req, res) => {

    // looking for the refresh token from the cookies
    let refresh_token = null
    if (req.headers.cookie) {
      const presentCookie = cookie.parse(req.headers.cookie)
      if ('refresh_token' in presentCookie) {
        refresh_token = presentCookie['refresh_token']
      }
    }

    // refresh token not found!
    if (refresh_token === null) {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.REFRESH_TOKEN_NOT_FOUND.code, data: null})
    }

    // if found, the refresh token still must be checked
    const refreshTokenInfo = JWT.verify(refresh_token)
    if (refreshTokenInfo.error || refreshTokenInfo.data.subject !== 'refresh') {
      res.statusCode = 403
      return res.json({ error: ErrorCodes.REFRESH_INVALID_TOKEN.code, data: null})
    }

    // From this point, we know we have a valid token. Though, the username and
    // email may be no longer in the DB.
    const username = refreshTokenInfo.data.username
    const email = refreshTokenInfo.data.email

    if (!DB.hasUserFromEmail(email)) {
      res.statusCode = 404
      res.json({ error: ErrorCodes.EMAIL_NOT_EXISTING.code, data: null})
    }

    if (!DB.hasUserFromUsername(username)) {
      res.statusCode = 404
      res.json({ error: ErrorCodes.USERNAME_NOT_EXISTING.code, data: null})
    }

    // from here, things are good.
    // Let's first update the refresh token
    const refreshToken = JWT.refreshToken(email, username)
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refresh_token', String(refreshToken), {
        maxAge: 60 * 60 * 24 * 365, // a year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      }
    ))

    // Then let's get an access token and send it back
    const accessToken = JWT.accessToken(email, username)
    res.statusCode = 200
    res.json({ error: null, data: accessToken})
  })


export default handler
