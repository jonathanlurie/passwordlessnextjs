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


  static signupMagicLink(email, username) {
    return JWT.sign({subject: 'signup', email, username}, '10m')
  }
}