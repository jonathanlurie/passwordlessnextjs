/**
 * Endpoint: GET /api/login?token=xxxxx
 * This endpoint is not to be used directly and is meant to to be targeted by
 * the magic link send as part of the login process.
 */

import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import accessToken from '../../core/backend/accessToken'
import initDB from '../../core/backend/DB'
import nc from 'next-connect'
import ErrorCodes from '../../core/fullstack/ErrorCodes'



const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(accessToken)
  .use(initDB)
  .get(async (req, res) => {
    // The user data has been already fetched using the access token
    // by the 'accessToken' middleware.
    // It is available at req.user

    res.statusCode = 200
    return res.json({data: req.user.strip(), error: null})
  })


  .post(async (req, res) => {
    // The user data has been already fetched using the access token
    // by the 'accessToken' middleware.
    // It is available at req.user

    if (!req.body) {
      res.statusCode = 417
      return res.json({data: null, error: ErrorCodes.MISSING_DATA_FOR_UPDATING.code})
    }

    if (typeof req.body !== 'object') {
      res.statusCode = 417
      return res.json({data: null, error: ErrorCodes.WRONG_DATA_FORMAT.code})
    }

    try {
      await req.user.updateSafe(req.body)
    } catch (e) {
      res.statusCode = 500
      console.log(e)
      return res.json({data: null, error: ErrorCodes.DATABASE_UPDATE_ERROR.code})
    }

    res.statusCode = 200
    return res.json({data: 'Data updated', error: null})
  })


export default handler