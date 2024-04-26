const  jwt = require  ('jsonwebtoken');
const ENV = require ( '../config.js')

/** auth middleware */
 async function Auth(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
  
      console.log("Decoded Token:", decodedToken);
  
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: "Authentication Failed!" });
    }
  }

 function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}

module.exports = {
    Auth,
    localVariables
}
  
