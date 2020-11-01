import DB from '../../core/backend/DB'
import apiLimiter from '../../core/backend/ApiLimiter'

/**
 * Endpoint: /api/hasusername
 * To check if a username is already in the DB
 */

export default (req, res) => {
  if (apiLimiter(req, res)) {
    return
  }

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
}
