const nodemailer = require('nodemailer');
const EventEmitter = require('events');

const emailEventEmitter = new EventEmitter();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'JopsHub Team <ahmed@JobsHub.io>';
  }

  // Send an email with specified subject and message
  async send(subject, message) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    // Emit the 'sendEmail' event with mailOptions
    emailEventEmitter.emit('sendEmail', mailOptions);
  }

  async sendWelcomeEmail() {
    const subject = 'Welcome To JopsHub Family 🚀';
    const message = `Welcome, ${this.firstName}! 🎉 We're excited to have you as part of the Jops community. Get ready to explore job opportunities, connect with amazing companies, and build your career. Let's make your job search journey a success together! 🌟`;
    await this.send(subject, message);
  }

  async sendPasswordResetEmail(message) {
    const subject = "Password Reset Request for Your JobsHub Account 🛡️"
    await this.send(subject, message);
  }
};

emailEventEmitter.on('sendEmail', async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASS_KEY,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
