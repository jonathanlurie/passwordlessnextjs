import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

// a middleware to add a uuid that represent a specific visitor.
// This is added to the cookie (encrypted)
// but for the sake of server-side reuse, it's also added in req.uniqueVisitorId.
// If it's already present in the cookies, then it's just rtrieved and the
// cookie is not overwritten.
export default function uniqueVisitorId(req, res, next) {
  const LIMITER_COOKIE_NAME = 'api_limiter'
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
        secure: process.env.NODE_ENV === 'production',
      }
    ))
  }

  // adding it in the req object
  req.uniqueVisitorId = uniqueVisitorId
  next()
}