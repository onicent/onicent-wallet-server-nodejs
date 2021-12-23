import generator from 'generate-password';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import SocialAccount from './social-account';

class FacebookServices extends SocialAccount {

  constructor() {
    super();
    this.signIn = this.signIn.bind(this)
  };

  async verifyTokenFacebookAccount(token) {
    try {
      let { data } = await axios({
        url:
          "https://graph.facebook.com/v11.0/me?fields=id,name,email,picture&access_token=" + token,
        method: "get",
      });
      return data;
    }
    catch (err) {
      console.log('Error token invalid!');
      return null;
    }
  };


  async signIn(req, res, next) {
    // If success verifyl token
    let verifyrequest = await this.verifyTokenFacebookAccount(req.body.accessToken);
    if (!verifyrequest) {
      res.status(401).send({ messenger: 'Token fail' });
    } else {
      let getUserByFacebookId = await this.findUser({ facebookId: verifyrequest.id });
      if (getUserByFacebookId) {

        let setToken = this.setJWT(getUserByFacebookId);
        res.status(200).send({ messenge: 'login successfully!', data: setToken });

      } else {

        let getUserByEmail = await this.findUser({ email: verifyrequest.email });
        if (getUserByEmail) {

          let email = verifyrequest.email;
          let data = { facebookId: verifyrequest.id };
          let updateFacebookIdForUser = await this.updateIdSocialAccount(email, data);
          let setToken = this.setJWT(updateFacebookIdForUser);
          res.status(200).send({ messenge: 'Login successfully!', data: setToken });

        } else {

          let data = {
            facebookId: verifyrequest.id,
            email: verifyrequest.email,
            roles: [],
            password: bcrypt.hashSync(generator.generate({
              length: 10,
              numbers: true
            }), 8),
            status: 1
          }
          let createNewUser = await this.signUp(data);
          let setToken = this.setJWT(createNewUser);
          res.status(200).send({ messenge: 'Login successfully!', data: setToken });

        }
      }
    }

  };
}

export default new FacebookServices;