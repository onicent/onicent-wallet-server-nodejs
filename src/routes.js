import verifyIfSignIn from './middlewares/verify.middleware';
// import auth from './middlewares/auth.middleware';
// // import Role from './middlewares/role.middleware';

// import users from './controllers/user.controller';

import googleLogin from './utils/social-account/google';
import facebookLogin from './utils/social-account/facebook';

// import userManager from './controllers/dashboard/user-manager.controller';

import account from './controllers/account.controller'
import userManager from './controllers/dashboard/user-manager.controller'

import brand from './controllers/dashboard/general/brand.controller';
import category from './controllers/dashboard/general/categoty.controller';
import supplier from './controllers/dashboard/general/supplier.controller';
import shop from './controllers/dashboard/general/shop.controller';
import product from './controllers/dashboard/product.controller';
import cart from './controllers/cart.controller';
import order from './controllers/dashboard/order-management.controller';

import productList from './controllers/product.controller';
import productDetail from './controllers/product-detail.controller';

import orderController from './controllers/order.controller';
// import orderUser from './controllers/order.controller';
// import ZaloPay from './utils/zalopay/zalopay';
// import payment from './controllers/payment.controller';

// Dashboard.

class routes {
  routes(app, router) {
    //-----------------------user-------------------------------//
    router.post("/users/signup", verifyIfSignIn(), account.signUp);
    router.post("/users/signin", verifyIfSignIn(), account.signIn);
    router.post("/users/reset-password", verifyIfSignIn(), account.resetPassword);
    router.post("/auth/facebook/signin", verifyIfSignIn(), facebookLogin.signIn);
    router.post("/auth/google/signin", verifyIfSignIn(), googleLogin.signIn);
    // Dashbard
    // Manager account
    
    router.get("/crypto", verifyIfSignIn(), async function (req, res, next) {
      // const account = await user.find();
      res.status(200).send([
        {
          "isUp": "",
           "cryptoIcon": "",
           "cryptoName": "",
           "cryptoShortName": "",
           "dataChart": "",
           "cryptoPriceNow": "",
           "upOrDownPercent": ""
        },
      ]);
    });

    router.get('/',
      async function (req, res, next) {
        // const account = await user.find();
        res.status(200).send('data: ');
      }
    );

    //use router api
    app.use('/api/v1', router);
  };
}

export default new routes;