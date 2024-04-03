const asyncHandler = require ("express-async-handler")

const UserModel = require ("../model/User.model") 
const  bcrypt = require ('bcrypt');
const jwt =  require ('jsonwebtoken');
const ENV = require  ('../config.js');
const otpGenerator = require  ('otp-generator');
const sendAccountDetailsEmail = require('./mailer.js');
const DisponibiliteModel = require('../model/disponibilite.Model');
const Courses = require('../model/coursesModel.js');

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

async function verifyUserByEmail(req, res, next) {
  try {
      const { email } = req.method === "GET" ? req.query : req.body;

      // Check the user existence
      let exist = await UserModel.findOne({ email });
      if (!exist) {
          console.log(`User not found for email: ${email}`);
          return res.status(404).send({ error: "Can't find User!" });
      }

      next();
  } catch (error) {
      console.log("Error in verifyUser middleware:", error);
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

  async function getUserByEmail(req, res) {
    const email = req.params.email;  // Assuming the parameter is in the URL path

    try {
        if (!email) {
            return res.status(400).send({ error: "Invalid email" });
        }

        const user = await UserModel.findOne({ email }).exec();

        if (!user) {
            return res.status(404).send({ error: "User Not Found" });
        }

        // Remove password from user
        // Mongoose returns unnecessary data with the object, so convert it into JSON
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).send(rest);
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


async function getUserToken(req, res) {
  try {
    const userId = req.user.userId; // Assuming the decoded token has a userId property

    const user = await UserModel.findById(userId); // Fetch user from the database by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // Return the entire user object
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getById(req, res) {
  try {
    
    const data = await UserModel.findById(req.params.userId);

    if (!data) {
      // If user with the specified ID is not found, return 404
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is found, return the data
    res.status(200).json(data);
  } catch (err) {
    // Handle any other errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/** GET: http://localhost:5000/api/generateOTP +query username  */

//  async function generateOTP(req,res){
//     req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
//     res.status(201).send({ code: req.app.locals.OTP })
//   }

async function generateOTP(req, res) {
  const { email } = req.method === "GET" ? req.query : req.body;

  try {
      if (!email) {
          return res.status(400).send({ error: "Invalid Email" });
      }

      // Check the existence of the user by email
      const exist = await UserModel.findOne({ email });
      if (!exist) {
          return res.status(404).send({ error: "Can't find User with the provided email!" });
      }

      req.app.locals.OTP = await otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false
      });

      res.status(201).send({ code: req.app.locals.OTP });
  } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
  }
}

  
  /** GET: http://localhost:8080/api/verifyOTP */
  
  //  async function verifyOTP(req,res){
  //   const { code } = req.query;
  //   if(parseInt(req.app.locals.OTP) === parseInt(code)){
  //       req.app.locals.OTP = null; // reset the OTP value
  //       req.app.locals.resetSession = true; // start session for reset password
  //       return res.status(201).send({ msg: 'Verify Successsfully!'})
  //   }
  //   return res.status(400).send({ error: "Invalid OTP"});
  // }
  async function verifyOTP(req, res) {
    const { code } = req.query;
    const OTP = req.app.locals.OTP;
  
    if (parseInt(OTP) === parseInt(code)) {
      req.app.locals.OTP = null; // Reset the OTP value
      req.app.locals.resetSession = true; // Start session for reset password
      return res.status(201).send({ msg: 'Verify Successfully!' });
    }
    
    return res.status(400).send({ error: "Invalid OTP" });
  }
  
  //success redirect user when otp is valid
  /** GET: http://localhost:5000/api/createResetSession */
  
  async function createResetSession(req,res){
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"})
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
      const { username, password, firstName, lastName, profile, email , mobile , address, dateNaiss } = req.body;
  
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
        dateNaiss,
        address,
        mobile,
        role: 'admin',
      });
  
      // Save the user
      await user.save();
      res.status(201).send({ msg: "Admin registered successfully" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  

  async function registerStudent(req, res) {
    try {
      const { username, password, firstName, lastName, profile, email, mobile, address, dateNaiss, sexe, courses, role, availability } = req.body;
  
      // Vérifie si le nom d'utilisateur ou l'e-mail existe déjà
      const existingUsername = await UserModel.findOne({ username });
      const existingEmail = await UserModel.findOne({ email });
  
      if (existingUsername) {
        throw new Error("Veuillez utiliser un nom d'utilisateur unique");
      }
      if (existingEmail) {
        throw new Error("Veuillez utiliser un e-mail unique");
      }
  
      // Hachez le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Créez un nouvel utilisateur avec les cours sélectionnés
      const user = new UserModel({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        profile: profile || '',
        email,
        dateNaiss,
        address,
        mobile,
        sexe,
        role,
        courses: courses // Assignez la liste de cours choisis à l'utilisateur
      });
  
      // Enregistrez l'utilisateur
  await user.save();
  
      // Enregistrez les disponibilités de l'utilisateur
      if (availability) {
        for (const { jour, heureDebut, heureFin } of availability) {
          await DisponibiliteModel.create({
            jour,
            heureDebut,
            heureFin,
            utilisateur: user._id
          });
        }
      }
  
      res.status(201).send({ msg: "Utilisateur enregistré avec succès" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  

//   async function registerStudent(req, res) {
//     try {
//         const { username, password, firstName, lastName, profile, email, mobile, address, dateNaiss, sexe, courses, role } = req.body;

//         // Vérifie si le nom d'utilisateur ou l'e-mail existe déjà
//         const existingUsername = await UserModel.findOne({ username });
//         const existingEmail = await UserModel.findOne({ email });

//         if (existingUsername) {
//             throw new Error("Veuillez utiliser un nom d'utilisateur unique");
//         }
//         if (existingEmail) {
//             throw new Error("Veuillez utiliser un e-mail unique");
//         }

//         // Hachez le mot de passe
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Créez un nouvel utilisateur avec les cours sélectionnés
//         const user = new UserModel({
//             username,
//             password: hashedPassword,
//             firstName,
//             lastName,
//             profile: profile || '',
//             email,
//             dateNaiss,
//             address,
//             mobile,
//             sexe,
//             role,
//             courses: courses // Assignez la liste de cours choisis à l'utilisateur
//         });

//         // Enregistrez l'utilisateur
//         await user.save();
//         res.status(201).send({ msg: "Utilisateur enregistré avec succès" });
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// }

  
  

  /** POST: http://localhost:8080/api/register/teacher */

  // async function registerTeacher(req, res) {
  //   try {
  //     const { username, password, firstName, lastName, profile, email, courseID } = req.body;
  
  //     // Vérifie si le nom d'utilisateur ou l'e-mail existe déjà
  //     const existingUsername = await UserModel.findOne({ username });
  //     const existingEmail = await UserModel.findOne({ email });
  
  //     if (existingUsername) {
  //       throw new Error("Veuillez utiliser un nom d'utilisateur unique");
  //     }
  //     if (existingEmail) {
  //       throw new Error("Veuillez utiliser un e-mail unique");
  //     }
  
  //     // Hachez le mot de passe
  //     const hashedPassword = await bcrypt.hash(password, 10);
  
  //     // Créez un nouvel utilisateur avec le cours sélectionné
  //     const user = new UserModel({
  //       username,
  //       password: hashedPassword,
  //       firstName,
  //       lastName,
  //       profile: profile || '',
  //       email,
  //       role: 'teacher',
  //       course: courseID // Assignez le cours choisi à l'utilisateur
  //     });
  
  //     // Enregistrez l'utilisateur
  //     await user.save();
  //     res.status(201).send({ msg: "Étudiant enregistré avec succès" });
  //   } catch (error) {
  //     res.status(500).send({ error: error.message });
  //   }
  // }
  
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
                                      username : user.username,
                                      role: user.role
                                  }, ENV.JWT_SECRET , { expiresIn : "24h"});

                      return res.status(200).send({
                          msg: "Login Successful...!",
                          username: user.username,
                          role: user.role,
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


/** PUT: http://localhost:5000/api/updateuser */

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
/** PUT: http://localhost:5000/api/resetPassword */
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

//method here cruud

/** add user*/
/** POST: http://localhost:5000/api/add */

async function add(req,res){
  try{
  console.log('data',req.body);
  const user=new UserModel(req.body)
 await user.save();
 res.status(200);
  }catch(err){
      res.status(400).send({error: err});
  }
}

/** get all users */
/** GET: http://localhost:5000/api/getall  */
async function getall(req,res){
  try{
  const data=await UserModel.find();
 res.status(200).send(data);
  }catch(err){
      res.status(400).send(err);
      //console.log()
  }
}

/** update user */
/** PUT: http://localhost:5000/api/update/:id  */
async function updatebyid(req,res){
  try{
await UserModel.findByIdAndUpdate(req.params.id,req.body);
res.status(200).send("updated");
  } catch(err){
      res.status(400).send(err);
  }
}

/** DELETE: http://localhost:5000/api/deleteuser/:id  */

async function deleteuser(req,res){
 
  try{
await UserModel.findByIdAndDelete(req.params.id);
res.status(200).send("deleted");
  } catch(err){
      res.status(400).send(err);
  }
}


async function CoursesByUser(req, res) {
  try {
    const userId = req.params.userId; // Supposons que vous recevez l'ID de l'utilisateur dans les paramètres de la requête
    
    const user = await UserModel.findById(userId).populate('courses');
    // Utilisez la méthode findById pour trouver l'utilisateur par son ID
    // Utilisez la méthode populate pour peupler le champ 'courses' avec les données des cours associés
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const courses = user.courses;
    // Récupérez tout le tableau de cours à partir de la propriété 'courses' de l'objet user
    
    res.json(courses);
    // Retournez le tableau de cours dans la réponse JSON
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
  }
}



module.exports = {
  
  CoursesByUser,
    verifyUser,
    add,
    getall,
    updatebyid,
    deleteuser,
    //register,
    login,
    getUser,
    updateUser,
    generateOTP,
    verifyOTP,
    createResetSession,
    resetPassword,
    //registerTeacher,
    registerStudent,
    registerAdmin,
    getUserByEmail,
    verifyUserByEmail,
    getUserToken,
    getById

}
