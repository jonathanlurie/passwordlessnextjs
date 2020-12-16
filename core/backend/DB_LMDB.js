import path from 'path'
import { open } from 'lmdb-store'
import { v4 as uuidv4 } from 'uuid'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import ErrorWithCode from '../fullstack/ErrorWithCode'

/*
On server side, things are stateless and the database is a key-value store.

A user is represented by 3 things:
- a username (chosen by the user, alphanumeric only, cannot be changed later)
- an email (chosen by the user, can be changed later by the user)
- a uuid (chosen automatically, cannot be changed)

In the DB, the key under which is stored the user infos is the uuid. The email
and the username are also keys but their values are the uuid of the user. This
is so that a user can be found in the DB using any of the 3 indentifier but
without data redundancy.

*/

let _stores = null

function getStores() {
  if (!_stores) {
    _stores = {}

    // we'll not use the default store except for creating
    // other stores that are properly named
    const defaultDb = open({
      path: process.env.DB_FILENAME,
      compression: true ,
    })
 
    // store the users where keys are uuid and value are object containing user data.
    // Data are: email, username, timestamp of creation
    _stores.users = defaultDb.openDB('users',
      {
        compression: true, 
      })

    // store where each key is a username and the associated values is the uuid of corresponding user
    _stores.usernames = defaultDb.openDB('usernames',
      {
        compression: true, 
      })

    // store where each key is an email and the associated values is the uuid of corresponding user
    _stores.emails = defaultDb.openDB('emails',
      {
        compression: true, 
      })

    // store where each key is a user's uuid and the associated value is an object, to store whatever
    _stores.userExtras = defaultDb.openDB('userExtras',
      {
        compression: true, 
      })

      DB.createAdmin()
      .then(() => {
        
      })
      .catch((e) => {
        console.log('ERROR: admin user creation failed')
      })
  }

  return _stores
}


export default class DB {
  static hasUserFromEmail(email) {
    if (email === undefined || email === null) {
      return false
    }
    const stores = getStores()
    return !(stores.emails.get(email) === undefined)
  }


  static hasUserFromUsername(username) {
    if (username === undefined || username === null) {
      return false
    }
    const stores = getStores()
    return !(stores.usernames.get(username) === undefined)
  }


  static hasUserFromUserId(userId) {
    if (userId === undefined || userId === null) {
      return false
    }
    const stores = getStores()
    return !(stores.users.get(userId) === undefined)
  }
  

  static getUserFromEmail(email) {
    if (email === undefined || email === null) {
      return null
    }
    const stores = getStores()
    const userId = stores.emails.get(email)

    if (!userId) {
      return null
    }

    const user = stores.users.get(userId)

    if (!user) {
      return null
    }

    return user
  }


  static getUserFromUsername(username) {
    if (username === undefined || username === null) {
      return null
    }
    const stores = getStores()
    const userId = stores.usernames.get(username)

    if (!userId) {
      return null
    }

    const user = stores.users.get(userId)

    if (!user) {
      return null
    }

    return user
  }

  
  static async createUser(email, username, admin = false) {
    if (username === undefined
    || username === null
    || email === undefined
    || email === null) {
      throw new ErrorWithCode('This email already exists', ErrorCodes.INVALID_ENTRY.code)
    }

    const stores = getStores()

    if (stores.emails.get(email) !== undefined) {
      throw new ErrorWithCode('This email already exists', ErrorCodes.EMAIL_ALREADY_EXISTS.code)
    }

    if (stores.usernames.get(username) !== undefined) {
      throw new ErrorWithCode('This username already exists', ErrorCodes.USERNAME_ALREADY_EXISTS.code)
    }

    const userId = uuidv4()
    
    // create the userentry in the 'users' DB
    await stores.users.put(userId, {
      userId,
      email,
      username,
      creationDate: Date.now(),
      lastConnectionDate: null,
      admin,
    })

    // create the entry for email lookup
    await stores.emails.put(email, userId)

    // create the entry for username lookup
    await stores.usernames.put(username, userId)

    // initialize the userExtras to an empty object
    await stores.userExtras.put(userId, '')
  }


  static async createAdmin() {
    const adminUsername = process.env.ADMIN_USERNAME
    const adminEmail = process.env.ADMIN_EMAIL

    if (!DB.hasUserFromUsername(adminUsername)) {
      console.log('Creating the admin user')
      await DB.createUser(adminEmail, adminUsername, true)
    } else {
      console.log('The admin user already exists')
    }
  }


  static getUserExtraDataById(userId) {
    if (userId === undefined || userId === null) {
      return null
    }
    const stores = getStores()
    const userExtra = stores.userExtras.get(userId)

    if (!userExtra) {
      return null
    }

    return userExtra
  }


  static async setUserExtraDataById(userId, userExtra) {
    if (userId === undefined || userId === null) {
      return false
    }
    const stores = getStores()
    await stores.userExtras.put(userId, userExtra)
    return true
  }

}