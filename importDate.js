const fs = require('fs');
require('dotenv').config({ path: './config.env' });
const Job = require('./models/jobModel');
const connectDatabase = require('./utilities/dataBase');

const jobsData = JSON.parse(fs.readFileSync(`${__dirname}/devData.js`, 'utf-8'))

const start = async () => {
  try {
    await connectDatabase(); // Connect to the database

    // First, delete existing data
    await Job.deleteMany();

    // Then, create new data
    await Job.create(jobsData);

    console.log('Data deleted and loaded successfully👍');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

start();