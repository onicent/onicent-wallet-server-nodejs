import generator from 'generate-password';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Users from '../models/account.model';
import Role from '../models/role.model';
import profile from '../models/profile.model';
import cart from '../models/cart.model';
import email from '../utils/email';
import shipping from '../models/shipping.model';
import webConfig from '../web.config.json';

class AccountController {

  constructor() {
    this.signUp = this.signUp.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  };

  async findUser(key) {
    let users = await Users.findOne(key).populate("roles", "-__v").exec();
    return users;
  };

  async signUp(req, res, next) {
    let requests = req.body;
    if (!requests.email || !requests.password) {
      return res.status(409).send({ message: 'Please input email, password!' });
    }
    let user = await this.findUser({ 'email': requests.email });
    if (user) {
      return res.status(302).send({ message: 'The Email was registered!' });
    }

    let role = await Role.findOne({ name: webConfig.roles.user });
    let data = {
      email: requests.email,
      password: bcrypt.hashSync(requests.password, 8),
      roles: [role._id],
      status: 1
    };
    let users = await Users.create(data);
    await profile.create({
      accountId: users._id
    });
    await cart.create({
      accountId: users._id
    });
    await shipping.create({
      accountId: users._id
    });
    users.roles = [role];

    res.status(200).send({ messenge: 'Login successfully!', data: users });

  };

  async signIn(req, res, next) {
    let requests = req.body;
    await Users.findOne({
      email: req.body.email
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(200).send({ message: "Email Not found.", data: null });
        }
        let passwd = bcrypt.hashSync(requests.password, 8);
        if (!user.password === passwd) {
          console.log(requests);

          return res.status(401).send({
            message: "Invalid Password!",
            data: null
          });
        }

        let token = jwt.sign({ id: user.id }, webConfig.token.secret, {
          expiresIn: webConfig.token.tokenLife
        });
        //let refreshToken =  RefreshToken.createToken(user);

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        let data = {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          fullname: user.fullname
          // refreshToken: refreshToken
        };
        console.log(requests);
        console.log(data);

        res.status(200).send({ messenge: 'Login successfully!', data: data });
      });
  };

  signOut(req, res, next) {

  }

  async resetPassword(req, res, next) {

    let requests = req.body;
    if (!requests.email) {
      return res.status(409).send({ message: 'Please input email!', data: null });
    }
    let user = await this.findUser({ 'email': requests.email });
    if (user) {

      let randomPassword = generator.generate({
        length: 5,
        numbers: true
      });
      let newPassword = { password: bcrypt.hashSync(randomPassword, 8) };
      await Users.findOneAndUpdate({ 'email': requests.email }, newPassword, { upsert: true });

      let sendTo = requests.email;
      let subject = 'Reset password account from SELLCLOSE';
      let htmlContent = randomPassword;
      email.sendMail(sendTo, subject, htmlContent);

      res.status(200).send('Plase check email ' + randomPassword);

    } else {

      return res.status(200).send({ message: 'Email not found!', data: null });
    }

  };

}

export default new AccountController;
