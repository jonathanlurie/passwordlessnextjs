

const ERRORS = {
  UNKNOWN_ERROR: {
    code: -1,
    message: 'Unknown error.',
  },
  EMAIL_ALREADY_EXISTS: {
    code: 1,
    message: 'This email is already taken.',
  },
  USERNAME_ALREADY_EXISTS: {
    code: 2,
    message: 'This username is already taken.',
  },
  EMAIL_NOT_EXISTING: {
    code: 3,
    message: 'This email address does not exist.',
  },
  EMAIL_NOT_PROVIDED: {
    code: 4,
    message: 'The email address must be provided.',
  },
  SIGNUP_MISSING_TOKEN: {
    code: 5,
    message: 'The signup token is missing.',
  },
  SIGNUP_INVALID_TOKEN: {
    code: 6,
    message: 'The signup token is invalid or expired.',
  },
  REFRESH_TOKEN_NOT_FOUND: {
    code: 7,
    message: 'The refresh token is missing.',
  },
  REFRESH_INVALID_TOKEN: {
    code: 8,
    message: 'The refresh token is invalid or expired.',
  },
  USERNAME_NOT_EXISTING: {
    code: 9,
    message: 'This username does not exist.',
  },
  LOGIN_MISSING_TOKEN: {
    code: 10,
    message: 'The login token is missing.',
  },
  LOGIN_INVALID_TOKEN: {
    code: 11,
    message: 'The login token is invalid or expired.',
  },
  CREDENTIALS_NOT_PROVIDED: {
    code: 12,
    message: 'The email and/or username must be provided.',
  },
  USER_NOT_EXISTING: {
    code: 13,
    message: 'This user does not exist.',
  },
  ACCESS_TOKEN_INVALID: {
    code: 14,
    message: 'The user must be logged in to access this content (access token invalid or missing)',
  },
  INVALID_ENTRY: {
    code: 15,
    message: 'The format of the email or username is incorrect.'
  },
  MISSING_DATA_FOR_UPDATING: {
    code: 16,
    message: 'Update cannot be performed because there is no data to update with.'
  },
  WRONG_DATA_FORMAT: {
    code: 17,
    message: 'The data is in an unexpected format.'
  },
  DATABASE_UPDATE_ERROR: {
    code: 18,
    message: 'The data could not be udated for due to a database issue.'
  },
  UPDATE_EMAIL_MISSING_TOKEN: {
    code: 19,
    message: 'The update-email token is missing.',
  },
  UPDATE_EMAIL_INVALID_TOKEN: {
    code: 20,
    message: 'The update-email token is invalid or expired.',
  },
}


export function getMessageFromCode(code) {
  const intCode = parseInt(code)
  let error = Object.values(ERRORS).filter(e => e.code === intCode)
  return error.length > 0 ? error[0].message : ERRORS.UNKNOWN_ERROR.message
}

export default ERRORS