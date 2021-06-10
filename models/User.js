const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [4, "Minimum password length is 4 characters"],
  },
})

userSchema.pre("save", async function (next) {
  user = this
  const salt = await bcrypt.genSalt()
  user.password = await bcrypt.hash(user.password, salt)

  next()
})

// static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({
    email,
  })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error("Incorrect password")
  }

  throw Error("incorrect email")
}

//user has to be the singular version of whatever we defined the db collection to be which is users
const User = mongoose.model("user", userSchema)

module.exports = User
