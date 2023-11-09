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
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Check if password and passwordConfirm match
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
})

//Compare Passwords
userSchema.methods.passwordMatching = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

//PASSWORD CHANGE CHECK
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

//HASH PASSWORD
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified (e.g., during user registration or update)
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordConfirm to undefined as it's no longer needed
    this.passwordConfirm = undefined;

    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (error) {
    return next(error);
  }
});


const User = mongoose.model('User', userSchema)

module.exports = User