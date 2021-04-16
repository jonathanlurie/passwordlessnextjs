import ErrorCodes from '../fullstack/ErrorCodes'
import JWT from './JWT'
import User from '../backend/DB/models/User'

/**
 * Middleware get access token data
 */
export default async function accessToken(req, res, next) {
  req.accessTokenData = null
  const bearer = req.headers.authorization

  if (!bearer) {
    res.statusCode = 401
    return res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
  }

  if (typeof bearer !== 'string' || !bearer.startsWith('Bearer')) {
    res.statusCode = 401
    return res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
  }

  const accessToken = bearer.split(' ').pop()
  const tokenInfo = JWT.verify(accessToken)
  
  if (tokenInfo.error) {
    res.statusCode = 401
    return res.json({ error: ErrorCodes.ACCESS_TOKEN_INVALID, data: null })
  }

  req.accessTokenData = {
    email: tokenInfo.data.email,
    username: tokenInfo.data.username,
  }

  const user = await User.findByUsername(tokenInfo.data.username)

  if (!user) {
    res.statusCode = 401
    return res.json({ error: ErrorCodes.USER_NOT_EXISTING, data: null })
  }

  req.user = user

  next()
}