import apiLimiter from '../../core/backend/apiLimiter'
import uniqueVisitorId from '../../core/backend/uniqueVisitorId'
import initDB from '../../core/backend/DB'
import nc from 'next-connect'
import User from '../../core/backend/DB/models/User'
import Tools from '../../core/fullstack/Tools'

/**
 * Endpoint: /api/hasusername
 * To check if a username is already in the DB
 */

const handler = nc()
  .use(uniqueVisitorId)
  .use(apiLimiter)
  .use(initDB)
  .get( async (req, res) => {
    
    if (!('username' in req.query)) {
      res.statusCode = 404
      return res.json({ found: false })
    }

    // taking a shortcut here
    if (!Tools.isUsername(req.query.username)) {
      res.statusCode = 404
      return res.json({ found: false })
    }

    const user = await User.findByUsername(req.query.username)

    if (user) {
      res.statusCode = 200
      res.json({ found: true })
    } else {
      res.statusCode = 404
      res.json({ found: false })
    }
  })


export default handler


