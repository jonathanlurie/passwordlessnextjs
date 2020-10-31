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
      path: '_lmdb_stores',
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
    _stores.userData = defaultDb.openDB('userExtras',
      {
        compression: true, 
      })

    // store where each key is a magic link and the associated values is an object containing 
    // the uuid of corresponding user and the timestamp of magic link creation.
    // A magic link is removed after being used.
    _stores.magicLinks = defaultDb.openDB('magicLinks',
      {
        compression: true, 
      })
  }

  return _stores
}


export default class DB {
  static hasUserFromEmail(email) {
    const stores = getStores()
    return !(stores.emails.get(email) === undefined)
  }


  static hasUserFromUsername(username) {
    const stores = getStores()
    return !(stores.usernames.get(username) === undefined)
  }


  static hasUserFromUserId(userId) {
    const stores = getStores()
    return !(stores.users.get(userId) === undefined)
  }
  

  static async createUser(email, username) {
    const stores = getStores()

    if (store.get(email) !== undefined) {
      throw new ErrorWithCode('This email already exists', ErrorCodes.EMAIL_ALREADY_EXISTS)
    }

    if (store.get(username) !== undefined) {
      throw new ErrorWithCode('This username already exists', ErrorCodes.USERNAME_ALREADY_EXISTS)
    }

    const userId = uuidv4()
    
    // create the userentry in the 'users' DB
    await stores.users.put(userId, {
      email,
      username,
      creationDate: Date.now(),
      lastConnectionDate: null,
    })

    // create the entry for email lookup
    await stores.emails.put(email, userId)

    // create the entry for username lookup
    await stores.usernames.put(username, userId)

    // initialize the userData to an empty object
    await stores.userData.put(userId, {})

    // send a magic link
    await DB.sendMagicLink(email)
  }


  static async sendMagicLink(email) {
    const stores = getStores()

    const userId = store.get(email)

    if (userId === undefined) {
      throw new ErrorWithCode('This email does not exist', ErrorCodes.EMAIL_NOT_EXISTING)
    }

    // create the entry for magic link
    const magicPhrase = uuidv4()

    stores.magicLinks.put(magicPhrase, {
      userId,
      creationDate: Date.now()
    })

    const magicLink = `${process.env.APP_URL}/api/connect?magic=${magicPhrase}`
    console.log('🔗 The magic link: ', magicLink)

    try {
      await Email.sendMagicLink()
    } catch (e) {
      console.log('💥', e)
    }
  }
}




// await myStore.put('greeting', { someText: 'Hello, World!' })
// myStore.get('greeting').someText // 'Hello, World!'