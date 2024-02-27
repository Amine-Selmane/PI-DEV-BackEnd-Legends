const express = require ("express")
const router = express.Router()

const controller = require('../controller/restController.js');
const {registerMail,sendOTPEmail} = require('../controller/mailer.js');
const {Auth , localVariables} =  require ('../middlware/auth.js');


// router.get('/',method name here)
/** Get methods*/
router.route('/user/:username').get(controller.getUser);//user with username
router.route('/userbyEmail/:email').get(controller.getUserByEmail);//user with email
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP);//verify generated otp
router.route('user/createResetSession').get(controller.createResetSession);//reset all the variables

// router.post('/',method name here)
/** Post methods*/
//router.route('/register').post(controller.register);//register user
router.route('/register/admin').post(controller.registerAdmin);//register admin
router.route('/register/student').post(controller.registerStudent);//register student
router.route('/register/teacher').post(controller.registerTeacher);//register teacher

router.route('/registerMail').post(registerMail);//send the email
router.route('/sendOTP').post(sendOTPEmail);//send the email
router.route('/authenticate').post(controller.verifyUser,(req,res) => res.end());//authenticate user
router.route('/login').post(controller.verifyUser,controller.login);//login in app

// router.put('/:id',method name here)
/** Put methods*/
router.route('/updateuser').put(Auth,controller.updateUser);//is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);//use the reset password

// router.delete('/:id',method name here)

module.exports = router