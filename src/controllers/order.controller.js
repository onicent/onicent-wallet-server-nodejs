import order from '../models/order.model';

class OrderController {
  async create(req, res, next) {
    let requests = req.body;
    console.log(requests);
    let orderDetail = [];
    requests.orderPayment.map((value) => {
      orderDetail.push({
        // idProduct: value.id,
        // idDetail: value.idDetail,
        name: value.name,
        image: value.image,
        // color: String,
        // size: String,
        price: value.price,
        quantity: value.quantity,
        // status: Number
      });
    });

    function makeid(length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return result;
    }

    let orders = new order({
      accountId: requests.accountId,
      deliveryAddress: requests.deliveryAddress,
      deliveryName: requests.deliveryName,
      deliveryPhone: requests.deliveryPhone,
      delivery: requests.delivery,
      paymentMethod: requests.paymentMethod,
      orderName: 'Order_' + makeid(7),
      accountId: requests.accountId,
      dateRequired: '10/3/2021',
      orderDetail: orderDetail,
      status: 1
    });

    // Save user to the database
    await orders.save((err, data) => {
      if (err) return console.log(err);
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: true });
    });
    console.log(orders);
  };

  async orderNotConfirm(req, res, next) {
    let orders = await order.find({ 'accountId': req.query.id, 'status': 1 });
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
  async orderDelivery(req, res, next) {
    let orders = await order.find({ 'accountId': req.query.id, 'status': 2 }).populate("accountId", "-__v").exec();
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
  async orderDelivered(req, res, next) {
    let orders = await order.find({ 'accountId': req.query.id, 'status': 3 }).populate("accountId", "-__v").exec();
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
}

export default new OrderController;
