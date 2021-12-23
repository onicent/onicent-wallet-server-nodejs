import { OAuth2Client } from 'google-auth-library';
import generator from 'generate-password';
import bcrypt from 'bcryptjs';

import SocialAccount from './social-account';
import webConfig from '../../web.config.json';

class GoogleServices extends SocialAccount {

  constructor() {
    super();
    this.signIn = this.signIn.bind(this);
  };

  async verifyTokenGoogleAccount(token) {
    console.log(token);
    let client = new OAuth2Client(webConfig.googleAuth.clientID);
    try {
      let ticket = await client.verifyIdToken({
        idToken: token,
        audience: webConfig.googleAuth.clientID
      });

      return ticket.getPayload();
    }
    catch (err) {
      console.log('Error token invalid!');
      return null;
    }
  };

  async signIn(req, res, next) {
    // If success verifyl token
    let verifyrequest = await this.verifyTokenGoogleAccount(req.body.accessToken);
    if (!verifyrequest) {
      res.status(401).send({ messenger: 'Token fail' });
    } else {

      let getUserByGoogleId = await this.findUser({ googleId: verifyrequest.sub });
      if (getUserByGoogleId) {

        let setToken = this.setJWT(getUserByGoogleId);
        res.status(200).send({ messenge: 'Login successfully!', data: setToken });

      } else {

        let getUserByEmail = await this.findUser({ email: verifyrequest.email });
        if (getUserByEmail) {

          let email = verifyrequest.email;
          let data = { googleId: verifyrequest.sub };
          let updateGoogleIdForUser = await this.updateIdSocialAccount(email, data);
          let setToken = this.setJWT(updateGoogleIdForUser);
          res.status(200).send({ messenge: 'Login successfully!', data: setToken });

        } else {

          let data = {
            googleId: verifyrequest.sub,
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

export default new GoogleServices;