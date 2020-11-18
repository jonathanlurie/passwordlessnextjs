/**
 * Endpoint: GET /api/login?token=xxxxx
 * This endpoint is not to be used directly and is meant to to be targeted by
 * the magic link send as part of the login process.
 */

import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import accessToken from '../../core/backend/accessToken'
import nc from 'next-connect'
import ErrorCodes from '../../core/fullstack/ErrorCodes'


const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(accessToken)
  .get(async (req, res) => {
    const email = req.accessTokenData.email
    const username = req.accessTokenData.username
    let user = DB.getUserFromEmail(email) || DB.getUserFromUsername(username)

    if (!user) {
      res.statusCode = 401
      return res.json({data: null, error: ErrorCodes.USER_NOT_EXISTING.code})
    }


    const userExtra = DB.getUserExtraDataById(user.userId)

    res.statusCode = 200
    return res.json({data: userExtra, error: null})
  })


export default handler

// http://localhost:3030/api/signup?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijoic2lnbnVwIiwiZW1haWwiOiJ6ZXJ0QHl0cmV6LmZyIiwidXNlcm5hbWUiOiJqb2pvIiwiaWF0IjoxNjA0NzU5NjQzLCJleHAiOjE2MDQ3NjAyNDN9._p45MmiWlqBgjMuB7B0Fmt2ylixQ3jtnAAc38lDytb4