const mongoose = require('mongoose')
// const { default: validator } = require("validator");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
      required: [true, 'Please provide the company name.'],
      maxlength: [50, 'Company name should be at most 50 characters.'],
      validate: {
        validator: function (value) {
          return !/^\s*$/.test(value); // Check if the value is not only whitespace
        },
        message: 'Please provide a valid company name',
      },
    },
    position: {
      type: String,
      required: [true, 'Please provide the position.'],
      maxlength: [100, 'Position should be at most 100 characters.'],
    },
    status: {
      type: String,
      enum: {
        values: ['interview', 'declined', 'pending'],
        message: 'status must be one of: interview, declined, pending.'
      },
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user.'],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
