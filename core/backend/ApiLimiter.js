import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

const LIMITER_COOKIE_NAME = 'api_limiter'
const LIMIT_PER_SECONDS = 10

let _visitors = {}

// clearing every 10 seconds to not bloat memory with visit records
setInterval(() => {
  _visitors = {}
}, 10000)


/**
 * Rejects (error code 429) queries if more than 10 per second
 * for a given user (with unique identifier) 
 */
export default function apiLimiter(req, res) {
  let uniqueVisitorId = null

  // check if a cookie exist
  // Check if the the cookies contain the unique visitor ID
  if (req.headers.cookie) {
    const presentCookie = cookie.parse(req.headers.cookie)

    if (LIMITER_COOKIE_NAME in presentCookie) {
      uniqueVisitorId = presentCookie[LIMITER_COOKIE_NAME]
    }
  }

  // if the cookie corresponding to the unique visitor ID was not found,
  // we create one and add it to the cookie for next time.
  if (!uniqueVisitorId) {
    uniqueVisitorId = uuidv4()

    res.setHeader(
      'Set-Cookie',
      cookie.serialize(LIMITER_COOKIE_NAME, String(uniqueVisitorId), {
        maxAge: 60 * 60 * 24 * 365, // a year
        httpOnly: true,
        secure: !!process.env.PRODUCTION,
      }
    ))
  }

  // timestamp in seconds
  const now = ~~(Date.now() / 1000)

  console.log(uniqueVisitorId)

  // adding an entry for this visitor
  if (!(uniqueVisitorId in _visitors)) {
    _visitors[uniqueVisitorId] = {}
  }

  // adding an entry for this timestamp
  if (!(now in _visitors[uniqueVisitorId])) {
    _visitors[uniqueVisitorId][now] = []
  }
  _visitors[uniqueVisitorId][now].push(1)

  if (_visitors[uniqueVisitorId][now].length > LIMIT_PER_SECONDS) {
    res.statusCode = 429
    res.json({ error: 'Too many requests' })
    return true
  }

  return false
}