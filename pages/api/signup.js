import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/ApiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import nc from 'next-connect'

/**
 * Endpoint: /api/signup
 * To check if an email is already in the DB
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .get((req, res) => {

    if (!('email' in req.query)) {
      res.statusCode = 404
      return res.json({ found: false })
    }

    if (DB.hasUserFromEmail(req.query.email)) {
      res.statusCode = 200
      res.json({ found: true })
    } else {
      res.statusCode = 404
      res.json({ found: false })
    }
  })


export default handler
