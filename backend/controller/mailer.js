const nodemailer = require('nodemailer');
const ENV = require('../config.js');

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL, // your Outlook email address
    pass: ENV.PASSWORD, // your Outlook password
  }
});


const registerMail = async (req, res) => {
  const { username, userEmail } = req.body;

  const emailBody = `Dear ${username},

  Congratulations on successfully signing up with us!

  You now have access to our services. If you need any assistance, feel free to reach out.
  
  Best,
  ElKindy`;

  const message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: "Welcome to ElKindy",
    text: emailBody
  };

  transporter.sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: "You should receive an email from us." });
    })
    .catch(error => res.status(500).send({ error }));
};



const sendOTPEmail = async (req, res) => {
  const { userEmail, username, otp } = req.body;


  const emailBody =`Dear ${username},

    Your OTP (One-Time Password) for password recovery is: ${otp}. 
    Please use this code to verify and recover your password.

    Best,
    ElKindy`;

  const message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: "Password Recovery OTP",
    text: emailBody
  };

  transporter.sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: "You should receive an email from us." });
    })
    .catch(error => res.status(500).send({ error }));
};





module.exports = {
  registerMail,
  sendOTPEmail
};