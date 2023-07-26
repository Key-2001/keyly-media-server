const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const newUser = new UserModel(req.body);
  const {username} = req.body;
  try {
    const oldUser = await UserModel.findOne({username});
    if(oldUser){
      return res.status(400).json({msg: "Username is already registered!"})
    }
    const user = await newUser.save();
    const token = jwt.sign({
      username: user.username, id: user._id
    }, process.env.JWT_KEY, {expiresIn: '1h'})
    return res.status(200).json({ msg: "Success", user: newUser, token: token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if(!validity){
        return res.status(400).json({msg: "Wrong password!"})
      }else{
        const token = jwt.sign({
          username: user.username, id: user._id
        }, process.env.JWT_KEY, {expiresIn: '1h'})
        return res.status(200).json({msg: "Success", user: user, token: token})
      }
      
    } else {
      return res.status(404).json({ msg: "User is not existed!" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
