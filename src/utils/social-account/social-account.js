import jwt from 'jsonwebtoken';
import Users from '../../models/account.model';
import profile from '../../models/profile.model';
import cart from '../../models/cart.model';
import Role from '../../models/role.model';
import shipping from '../../models/shipping.model';
import webConfig from '../../web.config.json';

class SocialAccount {
  setJWT(user) {
    if (!user) {
      console.log('Parameter is null');
      return null;
    }

    try {
      let token = jwt.sign({ id: user._id }, webConfig.token.secret, {
        expiresIn: webConfig.token.tokenLife
      });
      //let refreshToken =  RefreshToken.createToken(user);
      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      let send = {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        roles: authorities,
        accessToken: token
        // refreshToken: refreshToken
      };
      return send;
    } catch (error) {
      console.log('Error please check data input!');
      return null;
    }
  };

  async findUser(key) {
    let users = await Users.findOne(key).populate("roles", "-__v").exec();
    return users;
  };

  async signUp(data) {
    try {
      let role = await Role.findOne({ name: webConfig.roles.user });
      data.roles = [role._id];
      let users = await Users.create(data);
      await profile.create({
        accountId: users._id,
        fullname: users.email
      });
      await cart.create({ accountId: users._id });
      await shipping.create({ accountId: users._id });
      users.roles = [role];
      return users;
    } catch (error) {
      console.log('Error can not save document!');
      return null;
    }
  };

  async updateIdSocialAccount(email, data) {
    try {
      let users = await Users.findOneAndUpdate({ 'email': email }, data, { upsert: true })
        .populate("roles", "-__v")
        .exec();
      return users;
    } catch (error) {
      console.log('Error can not save document!');
      return null;
    }
  };
}

export default SocialAccount;