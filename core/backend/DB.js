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
    _stores.main = open({
      path: '_lmdb_stores',
      compression: true ,
    })
 
    // store the users where keys are uuid and value are object containing user data.
    // Data are: email, username, timestamp of creation
    _stores.users = _stores.main.openDB('users',
      {
        compression: true, 
      })

    // store where each key is a username and the associated values is the uuid of corresponding user
    _stores.usernames = _stores.main.openDB('usernames',
      {
        compression: true, 
      })

    // store where each key is an email and the associated values is the uuid of corresponding user
    _stores.emails = _stores.main.openDB('emails',
      {
        compression: true, 
      })

    // store where each key is a user's uuid and the associated value is an object, to store whatever
    _stores.userExtras = _stores.main.openDB('userExtras',
      {
        compression: true, 
      })

    // store where each key is a magic link and the associated values is an object containing 
    // the uuid of corresponding user and the timestamp of magic link creation.
    // A magic link is removed after being used.
    _stores.magicLinks = _stores.main.openDB('magicLinks',
      {
        compression: true, 
      })
  }

  return _stores
}


export default class DB {
  static async test() {
    const store = getStores()
    await store.users.put('greeting', { someText: 'Helloooooo, World!' })
  }

  static async test2() {
    const store = getStores()
    const greetings = store.users.get('greeting')
    console.log('greetings:', greetings)
  }


  static hasUserFromEmail(email) {
    const stores = getStores()
    return stores.emails.get(email) === undefined ? false : true
  }


  static usernameDoesExist(username) {
    const store = getStores()

  }
  
  static async createUser(email, username) {
    const store = getStores()

    if (store.get(email) !== undefined) {
      throw new ErrorWithCode('This email already exists', ErrorCodes.EMAIL_ALREADY_EXISTS)
    }

    if (store.get(username) !== undefined) {
      throw new ErrorWithCode('This username already exists', ErrorCodes.USERNAME_ALREADY_EXISTS)
    }
  }
}




// await myStore.put('greeting', { someText: 'Hello, World!' })
// myStore.get('greeting').someText // 'Hello, World!'