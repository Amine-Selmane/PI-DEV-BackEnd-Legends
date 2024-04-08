const express = require ("express")
const router = express.Router()

const controller = require('../controller/restController.js');
const {registerMail,sendOTPEmail,sendAccountDetailsEmail,PayementEmail} = require('../controller/mailer.js');
const {Auth , localVariables} =  require ('../middlware/auth.js');


// router.get('/',method name here)
/** Get methods*/
router.route('/:userId/courses').get(controller.CoursesByUser);
router.route('/user/:username').get(controller.getUser);//user with username
router.route('/userToken').get(Auth,controller.getUserToken);//
router.route('/user/ById/:userId').get(controller.getById);

router.route('/userbyEmail/:email').get(controller.getUserByEmail);//user with email
router.route('/generateOTP').get(controller.verifyUserByEmail, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyOTP);//verify generated otp
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.get('/getall',controller.getall);
// router.post('/',method name here)
/** Post methods*/
//router.route('/register').post(controller.register);//register user
router.route('/register/admin').post(controller.registerAdmin);//register admin
router.route('/register').post(registerMail,controller.registerStudent);//register student
//router.route('/register/teacher').post(controller.registerTeacher);//register teacher

router.route('/PayementEmail').post(PayementEmail);//send the email
router.route('/sendOTP').post(sendOTPEmail);//send the email
router.route('/authenticate').post(controller.verifyUser,(req,res) => res.end());//authenticate user
router.route('/login').post(controller.verifyUser,controller.login);//login in app

router.post("/add",sendAccountDetailsEmail,controller.add);

// router.put('/:id',method name here)
/** Put methods*/
router.route('/updateuser').put(Auth,controller.updateUser);//is use to update the user profile
router.put('/update/:id',controller.updatebyid);

router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);//use the reset password

// router.delete('/:id',method name here)
router.delete('/deleteuser/:id',controller.deleteuser);


module.exports = router
