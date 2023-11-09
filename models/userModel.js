const mongoose = require('mongoose');
const { default: validator } = require("validator");
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // User's name
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  // User's email
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  // User's password
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Password won't be included in query results
  },
  // Confirm password
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Custom validation to check if password and passwordConfirm match
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  // Timestamp of password change
  passwordChangedAt: Date,
});

// Compare Passwords
userSchema.methods.passwordMatching = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

// PASSWORD CHANGE CHECK
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt timestamp to seconds
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

// HASH PASSWORD before saving the user
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Set passwordConfirm to undefined as it's no longer needed
    this.passwordConfirm = undefined;

    // Update passwordChangedAt if it's not a new user
    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;

    next();
  } catch (error) {
    return next(error);
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
