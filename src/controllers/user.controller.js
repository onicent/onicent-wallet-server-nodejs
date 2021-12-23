const Users = require('../models/account.model');
const Profile = require('../models/profile.model');
const Role = require('../models/role.model');

const config = require('../web.config.json');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


/******************************************************************************
 * 
 *                              User Controller
 ******************************************************************************/

class UserController {


  signOut(req, res, next) {

  }

  profile(req, res, next) {
    jwt.verify(req.headers["x-access-token"], config.token.secret, (err, decoded) => req.userId = decoded.id);
    Users.findOne({ _id: req.userId }, function (err, user) {
      if (err) return res.send(err);
      res.send(user);
    });
  }








}





module.exports = new UserController;