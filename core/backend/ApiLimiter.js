import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

const LIMITER_COOKIE_NAME = 'api_limiter'
const INTERVAL_MS = 2000
let _visitors = {}

setInterval(() => {
  _visitors = {}
}, INTERVAL_MS  * 10)

export default function limit(req, res) {
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

  const now = Date.now()

  if (uniqueVisitorId in _visitors && ??????????????) {
    res.statusCode = 429
    res.json({ error: 'Too many requests' })
  }

  _visitors[uniqueVisitorId] 
}