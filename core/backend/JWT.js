import jwt from 'jsonwebtoken'


export default class JWT {
  /**
   * Create a JWT with the given payload
   * @param {Object} data - whatever object to encode 
   * @param {string} expiresIn - in the format of https://github.com/vercel/ms
   */
  static sign(data, expiresIn = '5m') {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
  }


  /**
   * Verify the given JWT
   * @param {string} token - a JWT
   * @return {Object|null} the decoded object of null if not verified
   */
  static verify(token) {
    try {
      return {
        data: jwt.verify(token, process.env.JWT_SECRET),
        error: null
      }
    } catch(e) {
      return {
        data: null,
        error: e,
      }
    }
  }


  /**
   * Generates a JWT that is only made for signup.
   * This kind of token is valid for only 10 minutes.
   * @param {string} email 
   * @param {string} username 
   * @return {string} a JWT with 'signup' as a subject
   */
  static signupMagicLink(email, username) {
    return JWT.sign({subject: 'signup', email, username}, process.env.SIGNUP_TOKEN_LIFETIME)
  }


  /**
   * Generates a JWT that is only made for loging in.
   * This kind of token is valid for only 10 minutes.
   * @param {string} username 
   * @return {string} a JWT with 'login' as a subject
   */
  static loginMagicLink(username) {
    return JWT.sign({subject: 'login', username}, process.env.LOGIN_TOKEN_LIFETIME)
  }


  /**
   * Generates a JWT that is only made for updating the email address.
   * This kind of token is valid for only 10 minutes.
   * @param {string} username 
   * @return {string} a JWT with 'login' as a subject
   */
  static emailUpdateMagicLink(username, futureEmail) {
    return JWT.sign({subject: 'emailUpdate', username, futureEmail}, process.env.LOGIN_TOKEN_LIFETIME)
  }


  /**
   * Generates a refresh token. Not meant to be shared with the user,
   * it is going to remain in a secure cookie.
   * This kind of token is valid for 3 days.
   * @param {*} username 
   */
  static refreshToken(username) {
    return JWT.sign({subject: 'refresh', username}, process.env.REFRESH_TOKEN_LIFETIME)
  }


  static accessToken(username) {
    return JWT.sign({subject: 'access', username}, process.env.ACCESS_TOKEN_LIFETIME)
  }
}