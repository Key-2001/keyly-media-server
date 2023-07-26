const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,
    password: hashedPass,
    firstName,
    lastName,
  });
  try {
    await newUser.save();
    return res.status(200).json({ msg: "Success", user: newUser });
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

      return validity
        ? res.status(200).json({ msg: "Success", user: user })
        : res.status(400).json({ msg: "Wrong password!" });
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
