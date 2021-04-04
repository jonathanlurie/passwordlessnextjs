import mongoose from 'mongoose'
import validator from 'validator'
import Tools from '../../../fullstack/Tools'


function init() {
  const userSchema = mongoose.Schema({
    username: {
      index: true,
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate: value => Tools.isUsername(value)
    },

    email: {
      index: true,
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: value => Tools.isEmail(value)
    },

    isAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },

    displayName: {
      type: String,
      required: false,
      trim: true,
    },

    githubUsername: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    instagramUsername: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    twitterUsername: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    website: {
      type: String,
      required: false,
      trim: true,
    },

    picture: {
      type: String,
      required: false
    },

    text: {
      type: String,
      required: false
    },
  })


  userSchema.methods.updateField = async function(key, value) {
    const user = this
    user[key] = value
    await user.save()
  }

  userSchema.methods.updateSafe = async function(keyValue) {
    const keyValueStripped = JSON.parse(JSON.stringify(keyValue))
    // let's delete the possibly existing annoying props
    delete keyValueStripped._id // this would conflict with MongoDB
    delete keyValueStripped.__v // this would conflict with MongoDB, though probably ignored
    delete keyValueStripped.username // a user cannot change its username
    delete keyValueStripped.email // this will be a on a dedicated endpoint/function that sends a validation email
    delete keyValueStripped.isAdmin // this will be on a dedicated endpoint/function
    const user = this

    Object.keys(keyValueStripped).forEach((key) => {
      user[key] = keyValueStripped[key]
    })
    
    await user.save()
  }


  userSchema.methods.updateEmail = async function(futureEmail) {
    this.email = futureEmail
    await this.save()
  }


  // turn the model into a plain JS object without MongoDB _props
  userSchema.methods.strip = function() {
    const obj = this.toObject({flattenMaps: true, versionKey: false})
    delete obj._id
    return obj
  }


  userSchema.statics.findByEmail = async function(email) {
    try {
      // Search for a user by email.
      const user = await User.findOne({ email })
      if (!user) {
        console.log(`No user found with the email ${email}`)
          return null
      }
      return user
    } catch (err) {
      console.log(err)
      return null
    }
  }


  userSchema.statics.findByUsername = async function(username) {
    // Search for a user by username.
    try {
      const user = await User.findOne({ username })
      if (!user) {
        console.log(`No user found with the username ${username}`)
          return null
      }
      return user
    } catch(err) {
      console.log(err)
      return null
    }
  }


  const User = mongoose.model('User', userSchema)
}


if (!process.browser && !mongoose.models.User) {
  init()
}

export default (mongoose.models ? mongoose.models.User : null)

