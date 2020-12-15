import mongoose from 'mongoose'
import User from './models/User'
import ErrorCodes from '../../core/fullstack/ErrorCodes'
import ErrorWithCode from '../fullstack/ErrorWithCode'


// if not already connected, then we connect.
// This allows us to import this file everytime we need to intect with DB
if (!mongoose.connection.readyState) {
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    }
  )

  // creating the admin user. Will fail if already here
  const user = new User({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    isAdmin: true,
  })

  try {
    await user.save()
    console.log('Admin user has been created.')
  } catch(err) {
    console.log('Admin user already exists.')
  }
}






export default class DB {
  static hasUserFromEmail(email) {
   
  }


  static hasUserFromUsername(username) {
    
  }


  static hasUserFromUserId(userId) {
    
  }
  

  static getUserFromEmail(email) {
    
  }


  static getUserFromUsername(username) {
    
  }

  
  static async createUser(email, username, admin = false) {
    
  }


  static async createAdmin() {
 
  }


  static getUserExtraDataById(userId) {
    
  }


  static async setUserExtraDataById(userId, userExtra) {
    
  }

}

