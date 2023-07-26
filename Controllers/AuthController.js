const UserModel = require('../Models/UserModel');

const registerUser = async (req,res) => {
  const {username, password, firstName, lastName} = req.body;
  const newUser = new UserModel({username, password, firstName, lastName});
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