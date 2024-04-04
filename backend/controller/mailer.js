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


async function PayementEmail(req, res, next) {
  try {
    const { email , firstName , lastName, datePay } = req.body;

    const emailBody = `Dear ${firstName} ${lastName},

    We are delighted to inform you that your recent payment has been successfully processed. This email serves as confirmation of your payment for your subscription.
    Date and Time of Payment: ${datePay}

    Best,
    ElKindy`;

    const message = {
      from: 'your-email@gmail.com',
      to: email,
      subject: "Account Details",
      text: emailBody
    };

    await transporter.sendMail(message);

    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

async function sendAccountDetailsEmail(req, res, next) {
  try {
    const { username, email, password , firstName , lastName} = req.body;

    const emailBody = `Dear ${firstName} ${lastName},

    Your account has been successfully created!

    Account Details:
    Username: ${username}
    Email: ${email}
    Password: ${password}

    Thank you for following the forget password steps to change your password and signing up !

    Best,
    ElKindy`;

    const message = {
      from: ENV.EMAIL,
      to: email,
      subject: "Account Details",
      text: emailBody
    };

    await transporter.sendMail(message);

    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

async function registerMail(req, res, next) {
  try {
    const { email,  firstName , lastName} = req.body;

    const emailBody = `Dear ${firstName} ${lastName},

    We are delighted to inform you that your pre-registration with us has been successful. Welcome to our community! To finalize your enrollment, we kindly request you to proceed with the payment.
    Once the payment is successfully processed, your registration will be complete. You will gain access to all the benefits and resources we have to offer.
    We look forward to having you as a valued member of our community. Thank you for choosing to be a part of our organization.

  Best regards,
  ElKindy`;

    const message = {
      from: ENV.EMAIL,
      to: email,
      subject: "Registration Confirmation ",
      text: emailBody
    };

    await transporter.sendMail(message);

    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}




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
  sendOTPEmail,
  sendAccountDetailsEmail,
  PayementEmail
};