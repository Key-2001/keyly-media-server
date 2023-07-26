const UserModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const registerUser = async (req,res) => {
  const {username, password, firstName, lastName} = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password,salt)

  const newUser = new UserModel({username, hashedPass, firstName, lastName});
  try {
    await newUser.save();
    return res.status(200).json({msg: 'Success', user: newUser})
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = {
  registerUser
}