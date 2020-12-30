/**
 * The GET /api/logout endpoint removes the refresh_token cookie
 * so that the user can no longer reresh the access token.
 * The return payload does not specify whether an access token
 * was effectively present in the cookie.
 */

import cookie from 'cookie'
import nc from 'next-connect'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'


const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .get((req, res) => {
    console.log('LOGOUT! deleting cookie')
    console.log('Is app in production mode? ', process.env.NODE_ENV === 'production')

    // A cookie cannot be explicitely deleted, so to remove the 
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refresh_token', '', {
        maxAge: 0, // zero second ago
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      }
    ))

    res.statusCode = 200
    res.json({ error: null })
  })

export default handler
