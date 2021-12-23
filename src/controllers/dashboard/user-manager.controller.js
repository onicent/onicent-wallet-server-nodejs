import generator from 'generate-password';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Users from '../../models/account.model';
import Role from '../../models/role.model';
import profile from '../../models/profile.model';
import cart from '../../models/cart.model';
import shipping from '../../models/shipping.model';
import email from '../../utils/email';
import webConfig from '../../web.config.json';
import fs from 'fs';

class UserManagerController {

  constructor() {
    this.addNewUser = this.addNewUser.bind(this);
  };

  async usersInfo(req, res, next) {
    let users = await Users.findOne({ '_id': req.query.id }).populate("roles", "-__v").exec();
    return res.status(200).send({ message: 'Get information successfuly!', data: users });
  };

  async roles(req, res, next) {
    let role = await Role.find().exec();
    res.status(200).send({ message: 'Get list role success!', data: role });
  };

  async addNewUser(req, res, next) {
    let requests = req.body;
    // console.log(requests);

    if (!requests.email || !requests.password) {
      return res.status(409).send({ message: 'Please input email, password!', data: null });
    }
    let user = await Users.findOne({ 'email': requests.email }).populate("roles", "-__v").exec();

    if (user) {
      return res.status(302).send({ message: 'The Email was registered!', data: null });
    }

    let data = {
      email: requests.email,
      password: bcrypt.hashSync(requests.password, 8),
      roles: requests.role,
      status: requests.status
    };
    let users = await Users.create(data);
    console.log(requests.image.split(',')[0]);
    let nameImage = users._id + '.' + 'jpeg';
    let storageImage = './src/public/storage/avatar/' + nameImage;

    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    fs.writeFile(storageImage, requests.image.split(',')[1], 'base64', function (err) {
      if (err) return console.error(err);
      console.log('file saved to ')
    });
    await profile.create({ accountId: users._id, fullname: requests.name, photo: nameImage });
    await cart.create({ accountId: users._id });
    await shipping.create({ accountId: users._id });
    res.status(200).send({ message: 'Add new user successfuly!', data: users });

  };

  async read(req, res, next) {
    // let users = await Users.find().populate("roles", "-__v").exec();
    let usersInfo = await profile.find().populate("accountId", "-__v").exec();
    let role = await Role.find().exec();
    res.status(200).send({ message: 'Get list user success!', roles: role, data: usersInfo });
  };

  async update(req, res, next) {
    let requests = req.body;
    let checkImage = requests.image.includes('public');

    await Users.findOneAndUpdate({ _id: requests.id }, requests.account, { upsert: true }, (err, account) => {
      if (err) return res.status(500).send({ message: 'error', data: err });

      if (!checkImage) {
        fs.writeFile(`./src/public/storage/avatar/${requests.id}.jpeg`, requests.image.split(',')[1], 'base64', function (err) {
          if (err) return console.error(err);
          console.log('file saved to ')
        });
      }

      profile.findOneAndUpdate({ accountId: account._id }, requests.profile, { upsert: true }, (err) => {
        if (err) return res.status(500).send({ message: 'error', data: err });
        res.status(200).send({ message: 'Update new data successfully!', data: null });
      });
    });

  };

  async delete(req, res, next) {
    let requests = req.body;
    let profiles = await profile.findOne({ _id: requests.id }).populate("accountId", "-__v").exec();
    let accountId = profiles.accountId._id;

    await cart.deleteOne({ accountId: accountId });
    await shipping.deleteOne({ accountId: accountId });
    await profile.deleteOne({ accountId: accountId });
    await Users.deleteOne({ _id: accountId });
    res.status(200).send({ message: 'Delete successfully!', data: null });


    // await Users.deleteOne({ _id: requests.id }, (err) => {
    //   if (err) return res.status(500).send({ message: 'error', data: err });
    //   res.status(200).send({ message: 'Delete successfully!', data: null });
    // });

    // await Users.deleteOne({ _id: requests.id }, (err) => {
    //   if (err) return res.status(500).send({ message: 'error', data: err });
    //   res.status(200).send({ message: 'Delete successfully!', data: null });
    // });
  };

}

export default new UserManagerController;
