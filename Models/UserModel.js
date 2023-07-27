const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profilePicture: String,
  coverPicture: String,
  about: String,
  livesIn: String,
  worksAt: String,
  relationship: String,
  country: String,
  followers: [],
  following: []
},
{
  timestamps: true
});
const UserModel = mongoose.model("Users",UserSchema);
module.exports = UserModel;