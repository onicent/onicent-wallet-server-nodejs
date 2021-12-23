const fs = require('fs');
const NodeRSA = require('node-rsa');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = require('../../config.json');
const Crypto = require('./Crypto');

const { v1: uuid } = require('uuid');

const publicKey = fs.readFileSync('./src/utils/zalopay/publickey.pem', 'utf8');
const rsa = new NodeRSA(publicKey, {
  encryptionScheme: 'pkcs1'
});

let uid = Date.now();

async function GetPublicURL() {
  const { data } = await axios.get(config.ngrok.tunnels);
  return data.tunnels[0].public_url;
}

class ZaloPay {
  constructor() {
    const self = this;
    GetPublicURL().then(publicURL => {
      console.log('[Public_url]', publicURL);
      self.publicURL = publicURL;
    });
  }

  VerifyCallback(data, requestMac) {
    const result = {};
    const mac = CryptoJS.HmacSHA256(data, config.key2).toString();

    if (mac !== requestMac) {
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    } else {
      result.returncode = 1;
      result.returnmessage = "success";
    }

    return result;
  }

  GenTransID() {
    return `${moment().format('YYMMDD')}_${config.appid}_${++uid}`;
  }

  NewOrder({ amount, description }) {
    const self = this;
    return {
      amount,
      description,
      appid: config.appid,
      appuser: "Demo",
      embeddata: JSON.stringify({
        forward_callback: self.publicURL + '/callback',
        description,
      }),
      item: JSON.stringify([
        { name: "demo item", amount }
      ]),
      apptime: Date.now(),
      apptransid: this.GenTransID()
    }
  }

  async CreateOrder(req, res, next) {
    // console.log(req.data);
    // const config = {
    //   appid: '553',
    //   key1: '9phuAOYhan4urywHTh0ndEXiV3pKHr5Q',
    //   key2: 'Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3',
    //   endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder'
    // };

    // const embeddata = {
    //   merchantinfo: 'embeddata123'
    // };

    // const items = [{
    //   itemid: 'knb',
    //   itemname: 'kim nguyen bao',
    //   itemprice: 198400,
    //   itemquantity: 1
    // }];

    // const order = {
    //   appid: config.appid,
    //   apptransid: `${moment().format('YYMMDD')}_${uuid()}`,
    //   apptime: Date.now(), // miliseconds
    //   item: JSON.stringify(items),
    //   embeddata: JSON.stringify(embeddata),
    //   appuser: 'demo',
    //   amount: 5000,
    //   description: 'ZaloPay Integration Demo',
    //   bankcode: 'zalopayapp',
    // };

    // // appid|apptransid|appuser|amount|apptime|embeddata|item
    // const gach = '|';
    // const data = config.appid + gach + order.apptransid + gach + order.appuser + gach + order.amount + gach + order.apptime + gach + order.embeddata + gach + order.item;
    // order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // const result = await axios.post(config.endpoint, null, {
    //   params: order
    // });
    // console.log(result.data);
    return res.status(200).send({ message: 'Order!', data: 'hello' });
    // return result;
  }

  Gateway(params = {}) {
    const order = this.NewOrder(params);
    order.mac = Crypto.Mac.CreateOrder(order);

    const orderJSON = JSON.stringify(order);
    const b64Order = Buffer.from(orderJSON).toString('base64');
    return config.api.gateway + encodeURIComponent(b64Order);
  }

  async QuickPay(params = {}) {
    const order = this.NewOrder(params);
    order.userip = "127.0.0.1";
    order.paymentcode = rsa.encrypt(params.paymentcodeRaw, 'base64');
    order.mac = Crypto.Mac.QuickPay(order, params.paymentcodeRaw);

    const { data: result } = await axios.post(config.api.quickpay, null, {
      params: order
    });

    result.apptransid = order.apptransid;
    return result;
  }

  async GetOrderStatus(apptransid = "") {
    const params = {
      appid: config.appid,
      apptransid,
    }
    params.mac = Crypto.Mac.GetOrderStatus(params);

    const { data: result } = await axios.post(config.api.getorderstatus, null, {
      params
    });

    return result;
  }

  async Refund({ zptransid, amount, description }) {
    const refundReq = {
      appid: config.appid,
      zptransid,
      amount,
      description,
      timestamp: Date.now(),
      mrefundid: this.GenTransID()
    }

    refundReq.mac = Crypto.Mac.Refund(refundReq);

    const { data: result } = await axios.post(config.api.refund, null, {
      params: refundReq
    });

    result.mrefundid = refundReq.mrefundid;
    return result;
  }

  async GetRefundStatus(mrefundid) {
    const params = {
      appid: config.appid,
      mrefundid,
      timestamp: Date.now(),
    }

    params.mac = Crypto.Mac.GetRefundStatus(params);

    const { data: result } = await axios.post(config.api.getrefundstatus, null, {
      params
    });

    return result;
  }

  async GetBankList() {
    const params = {
      appid: config.appid,
      reqtime: Date.now(),
    }

    params.mac = Crypto.Mac.GetBankList(params);

    const { data: result } = await axios.post(config.api.getbanklist, null, {
      params
    });

    return result;
  }
}

module.exports = new ZaloPay();