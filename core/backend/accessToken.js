import ErrorCodes from '../fullstack/ErrorCodes'
import JWT from './JWT'

/**
 * Middleware get access token data
 */
export default function accessToken(req, res, next) {
  req.accessTokenData = null
  const bearer = req.headers.authorization

  if (!bearer) {
    res.statusCode = 401
    res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
    return next()
  }

  if (typeof bearer !== 'string' || !bearer.startsWith('Bearer')) {
    res.statusCode = 401
    res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
    return next()
  }

  const accessToken = bearer.split(' ').pop()
  const tokenInfo = JWT.verify(accessToken)
  
  if (tokenInfo.error) {
    res.statusCode = 401
    res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
    return next()
  }

  req.accessTokenData = {
    email: tokenInfo.data.email,
    username: tokenInfo.data.username,
  }

  next()
}