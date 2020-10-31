import DB from '../../core/backend/DB'

/**
 * Endpoint: /api/hasmail
 * To check if an email is already in the DB
 */

export default (req, res) => {
  if (!('email' in req.query))
  console.log('req.query:', req.query)
  let email = null

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
}
