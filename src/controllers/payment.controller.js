import cart from '../models/cart.model';
import product from '../models/product.model';
import paypal from 'paypal-rest-sdk';

import fs from 'fs';
import NodeRSA from 'node-rsa';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { v1 as uuid } from 'uuid';

import config from '../config.json';
import Crypto from '../utils/zalopay/Crypto.js';

const publicKey = fs.readFileSync('./src/utils/zalopay/publickey.pem', 'utf8');
const rsa = new NodeRSA(publicKey, {
  encryptionScheme: 'pkcs1'
});

let uid = Date.now();

async function GetPublicURL() {
  const { data } = await axios.get(config.ngrok.tunnels);
  return data.tunnels[0].public_url;
}

class PaymentController {
  constructor() {
    const self = this;
    GetPublicURL().then(publicURL => {
      console.log('[Public_url]', publicURL);
      self.publicURL = publicURL;
    });
  }

  async paypalPayment(req, res, next) {
    paypal.configure({
      'mode': 'sandbox', //sandbox or live
      'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
      'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
    });
    var create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "item",
            "sku": "item",
            "price": "1.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": "1.00"
        },
        "description": "This is the payment description."
      }]
    };


    let requests = req.body;
    await cart.findOneAndUpdate(id, { $pull: { productId: { _id: requests.id } } }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Remove to cart successfully!', data: null });
    });
  };

  async zalopayCreateOrder(req, res, next) {
    console.log(req.body);

    const config = {
      appid: '553',
      key1: '9phuAOYhan4urywHTh0ndEXiV3pKHr5Q',
      key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
      endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder'
    };

    const embeddata = {
      merchantinfo: 'embeddata123'
    };

    const items = [{
      itemid: 'knb',
      itemname: 'kim nguyen bao',
      itemprice: 198400,
      itemquantity: 1
    }];

    const order = {
      appid: config.appid,
      apptransid: `${moment().format('YYMMDD')}_${uuid()}`,
      apptime: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embeddata: JSON.stringify(embeddata),
      appuser: req.body.appuser,
      amount: req.body.amount,
      description: req.body.description,
      bankcode: 'zalopayapp',
    };

    // appid|apptransid|appuser|amount|apptime|embeddata|item
    const gach = '|';
    const data = config.appid + gach + order.apptransid + gach + order.appuser + gach + order.amount + gach + order.apptime + gach + order.embeddata + gach + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, {
      params: order
    });
    result.data.apptransid = order.apptransid;
    console.log(result.data);
    return res.status(200).send({ message: 'Order!', data: result.data });
  };
  async VerifyCallback(req, res, next) {
    console.log(req.body.apptransid);
    // const data, requestMac;
    // const result = {};
    // const mac = CryptoJS.HmacSHA256(data, config.key2).toString();

    // if (mac !== requestMac) {
    //   result.returncode = -1;
    //   result.returnmessage = "mac not equal";
    // } else {
    //   result.returncode = 1;
    //   result.returnmessage = "success";
    // }

    // return result;
    const params = {
      appid: config.appid,
      apptransid: req.body.apptransid,
    }
    params.mac = Crypto.Mac.GetOrderStatus(params);

    // const { data: result } = await axios.post(config.api.getorderstatus, null, {
    //   params
    // });

    function start(counter) {
      if (counter < 300) {
        setTimeout(async function () {
          counter++;
          let { data: result } = await axios.post(config.api.getorderstatus, null, {
            params
          });
          if (result.returncode === 1) {
            res.status(200).send({ message: 'Order!', data: result })
          }
          start(counter);
        }, 1000);
      }
    }
    start(0);
    console.log(result);
    // setTimeout(function () {
    //   res.status(200).send({ message: 'Order!', data: 'loloo' })
    // }, 5000);
  }
}

export default new PaymentController;