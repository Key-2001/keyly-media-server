const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddleware = async (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if(token){
      const decode = jwt.verify(token, secret);
      console.log(decode);
      req.body._id = decode?.id
    }
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = authMiddleware