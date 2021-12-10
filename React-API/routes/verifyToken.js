const jwt = require("jsonwebtoken")


const verifyToken = (req, res, next) =>{
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader
        console.log("token",token)
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid");
            req.user = user;
            console.log(user)
            next();
        });
    } else {
        return res.status(401).json("You are not authHenticated !");
    }
};

//verifyToken And Authorization
const VerandAuth = (req, res, next) => {
    
    verifyToken(req, res, () => {
        console.log("user",req.user)
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else{
            res.status(403).json("You are not alowed to do that !");
        }
    });
};

//verifyToken and Admin
const VerandAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

module.exports = {verifyToken, VerandAuth, VerandAdmin };