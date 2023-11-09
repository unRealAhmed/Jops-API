const mongoose = require('mongoose');

// Define the schema for the Job model
const JobSchema = new mongoose.Schema(
  {
    // Company field details
    company: {
      type: String,
      trim: true,
      required: [true, 'Please provide the company name.'],
      maxlength: [50, 'Company name should be at most 50 characters.'],
      validate: {
        // Custom validation to check if the value is not only whitespace
        validator: function (value) {
          return !/^\s*$/.test(value);
        },
        message: 'Please provide a valid company name',
      },
    },
    // Position field details
    position: {
      type: String,
      required: [true, 'Please provide the position.'],
      maxlength: [100, 'Position should be at most 100 characters.'],
    },
    // Status field details
    status: {
      type: String,
      enum: {
        values: ['interview', 'declined', 'pending'],
        message: 'status must be one of: interview, declined, pending.',
      },
      default: 'pending',
    },
    // CreatedBy field details
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user.'],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Job model
const Job = mongoose.model('Job', JobSchema);

// Export the Job model
module.exports = Job;
