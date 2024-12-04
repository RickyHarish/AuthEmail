const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host:process.env.HOST,
      service:process.env.SERVICE,
      post:Number(process.env.EMAIL_PORT),
      secure:Boolean(process.env.SECURE),
      auth:{
        user:process.env.USER,
        pass:process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
