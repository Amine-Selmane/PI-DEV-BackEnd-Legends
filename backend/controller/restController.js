const asyncHandler = require ("express-async-handler")

const UserModel = require ("../model/User.model") 
const  bcrypt = require ('bcrypt');
const jwt =  require ('jsonwebtoken');
const ENV = require  ('../config.js');
const otpGenerator = require  ('otp-generator');



/** middlware for verify user */
 async function verifyUser(req, res, next) {
    try {
      const { username } = req.method === "GET" ? req.query : req.body;
      // Check the user existence
      let exist = await UserModel.findOne({ username });
      if (!exist) return res.status(404).send({ error: "Can't find User!" });
      next();
    } catch (error) {
      return res.status(404).send({ error: "Authentication Error" });
    }
  }
//Get 
//@Route  Get /path/path
//@Desc



/** GET: http://localhost:8080/api/user/example123 */

 async function getUser(req, res) {
    const { username } = req.params;
  
    try {
      if (!username) {
        return res.status(400).send({ error: "Invalid Username" });
      }
  
      const user = await UserModel.findOne({ username }).exec();
  
      if (!user) {
        return res.status(404).send({ error: "User Not Found" });
      }
  
     /** remove password from user */
              // mongoose return unnecessary data with object so convert it into json
     const { password, ...rest } = Object.assign({}, user.toJSON());
  
      return res.status(200).send(rest);
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

/** GET: http://localhost:8080/api/generateOTP +query username  */

 async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
  }
  
  /** GET: http://localhost:8080/api/verifyOTP */
  
   async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
  }
  
  //success redirect user when otp is valid
  /** GET: http://localhost:8080/api/createResetSession */
  
   async function createResetSession (req,res){
    
    if(req.app.locals.resetSession ){
      req.app.locals.resetSession = false//allow access to this route only 1
      return res.status(201).send({msg : "Access Granted!"})
    } 
    return res.status(440).send({error : "Session espired!"})
   
  }

//Set 
//@Route  POST /path/path
//@Desc


/** POST: http://localhost:8080/api/register */

//  async function register(req, res) {
//     try {
//       const { username, password, profile, email } = req.body;
  
//       // Vérifier l'existence de l'utilisateur
//       const existUsername = UserModel.findOne({ username });
//       const existEmail = UserModel.findOne({ email });
  
//       Promise.all([existUsername, existEmail])
//         .then(([existingUsername, existingEmail]) => {
//           if (existingUsername) {
//             throw new Error("Please use unique username");
//           }
//           if (existingEmail) {
//             throw new Error("Please use unique Email");
//           }
  
//           // Hasher le mot de passe
//           bcrypt.hash(password, 10)
//             .then(hashedPassword => {
//               const user = new UserModel({
//                 username,
//                 password: hashedPassword,
//                 profile: profile || '',
//                 email
//               });
  
//               // Enregistrer l'utilisateur
//               user.save()
//                 .then(() => res.status(201).send({ msg: "User Register Successfully" }))
//                 .catch(error => res.status(500).send({ error }));
//             })
//             .catch(error => {
//               res.status(500).send({ error:  "Enable to hashed password" });
//             });
//         })
//         .catch(error => {
//           res.status(500).send({ error });
//         });
//     } catch (error) {
//       res.status(500).send({ error });
//     }
//   }

/** tous les registres des differents roles */


/** POST: http://localhost:8080/api/register/admin */
async function registerAdmin(req, res) {
    try {
      const { username, password, firstName, lastName, profile, email } = req.body;
  
      // Check if the username or email already exists
      const existingUsername = await UserModel.findOne({ username });
      const existingEmail = await UserModel.findOne({ email });
  
      if (existingUsername) {
        throw new Error("Please use a unique username");
      }
      if (existingEmail) {
        throw new Error("Please use a unique email");
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new UserModel({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        profile: profile || '',
        email,
        role: 'admin'
      });
  
      // Save the user
      await user.save();
      res.status(201).send({ msg: "Admin registered successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  

  /** POST: http://localhost:8080/api/register/student */

  async function registerStudent(req, res) {
    try {
      const { username, password,firstName, lastName, profile, email } = req.body;
  
      // Check if the username or email already exists
      const existingUsername = await UserModel.findOne({ username });
      const existingEmail = await UserModel.findOne({ email });
  
      if (existingUsername) {
        throw new Error("Please use a unique username");
      }
      if (existingEmail) {
        throw new Error("Please use a unique email");
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new UserModel({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        profile: profile || '',
        email,
        role: 'student'
      });
  
      // Save the user
      await user.save();
      res.status(201).send({ msg: "Student registered successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  

  /** POST: http://localhost:8080/api/register/teacher */

  async function registerTeacher(req, res) {
    try {
      const { username, password,firstName, lastName, profile, email } = req.body;
  
      // Check if the username or email already exists
      const existingUsername = await UserModel.findOne({ username });
      const existingEmail = await UserModel.findOne({ email });
  
      if (existingUsername) {
        throw new Error("Please use a unique username");
      }
      if (existingEmail) {
        throw new Error("Please use a unique email");
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new UserModel({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        profile: profile || '',
        email,
        role: 'teacher'
      });
  
      // Save the user
      await user.save();
      res.status(201).send({ msg: "Teacher registered successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  
/** POST: http://localhost:8080/api/login */

 async function login(req,res){
   
  const { username, password } = req.body;

  try {
      
      UserModel.findOne({ username })
          .then(user => {
              bcrypt.compare(password, user.password)
                  .then(passwordCheck => {

                      if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                      // create jwt token
                      const token = jwt.sign({
                                      userId: user._id,
                                      username : user.username
                                  }, ENV.JWT_SECRET , { expiresIn : "24h"});

                      return res.status(200).send({
                          msg: "Login Successful...!",
                          username: user.username,
                          token
                      });                                    

                  })
                  .catch(error =>{
                      return res.status(400).send({ error: "Password does not Match"})
                  })
          })
          .catch( error => {
              return res.status(404).send({ error : "Username not Found"});
          })

  } catch (error) {
      return res.status(500).send({ error});
  }
}




//Put 
//@Route  PUT /path/path/:id
//@Desc   


/** PUT: http://localhost:8080/api/updateuser */

 async function updateUser(req, res) {
    try {
      const { userId } = req.user;
  
      if (userId) {
        const body = req.body;
  
        // Use async/await with updateOne instead of callback
        const result = await UserModel.updateOne({ _id: userId }, body);
  
        if (result.modifiedCount === 1) {
          return res.status(201).send({ msg: "Record Updated Successfully...!" });
        } else {
          return res.status(404).send({ error: "User Not Found...!" });
        }
      } else {
        return res.status(401).send({ error: "User ID not available in request...!" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }


//update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
 async function resetPassword(req, res) {
    try {
      if (!req.app.locals.resetSession) {
        return res.status(440).send({ error: "Session expired!" });
      }
  
      const { username, password } = req.body;
  
      try {
        const user = await UserModel.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ error: "Username not Found" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const updateResult = await UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword }
        );
  
        req.app.locals.resetSession = false; // reset session
        return res.status(201).send({ msg: "Record Updated...!" });
      } catch (error) {
        return res.status(500).send({ error: "Unable to update password" });
      }
    } catch (error) {
      return res.status(401).send({ error });
    }
  }

//delete 
//@Route  DELETE /path/path/:id
//@Desc   

//method here


module.exports = {
    verifyUser,
    //register,
    login,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword,
    registerTeacher,
    registerStudent,
    registerAdmin

}