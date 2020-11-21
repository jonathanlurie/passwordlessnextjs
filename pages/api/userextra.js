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


  .post(async (req, res) => {
    const email = req.accessTokenData.email
    const username = req.accessTokenData.username
    let user = DB.getUserFromEmail(email) || DB.getUserFromUsername(username)

    if (!user) {
      res.statusCode = 401
      return res.json({data: null, error: ErrorCodes.USER_NOT_EXISTING.code})
    }

    if (!req.body) {
      res.statusCode = 417
      return res.json({data: null, error: ErrorCodes.MISSING_DATA_FOR_UPDATING.code})
    }

    if (typeof req.body !== 'object') {
      res.statusCode = 417
      return res.json({data: null, error: ErrorCodes.WRONG_DATA_FORMAT.code})
    }

    DB.setUserExtraDataById(user.userId, req.body)

    res.statusCode = 200
    return res.json({data: 'Data updated', error: null})
  })


export default handler