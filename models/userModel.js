const mongoose = require('mongoose')
const { default: validator } = require("validator");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   validate: {
  //     // Check if password and passwordConfirm match
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: "Passwords are not the same!",
  //   },
  // }
})

//Compare Passwords
userSchema.methods.passwordMatching = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

//HASH PASSWORD
userSchema.pre('save', async function (next) {
  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema)

module.exports = User