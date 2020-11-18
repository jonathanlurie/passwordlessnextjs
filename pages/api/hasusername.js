import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import nc from 'next-connect'

/**
 * Endpoint: /api/hasusername
 * To check if a username is already in the DB
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .get((req, res) => {
    
    if (!('username' in req.query)) {
      res.statusCode = 404
      return res.json({ found: false })
    }

    if (DB.hasUserFromUsername(req.query.username)) {
      res.statusCode = 200
      res.json({ found: true })
    } else {
      res.statusCode = 404
      res.json({ found: false })
    }
  })


export default handler


