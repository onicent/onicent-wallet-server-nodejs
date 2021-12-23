import order from '../../models/order.model';

class OrderConfirmController {
  async listOrderNotConfirm(req, res, next) {
    let orders = await order.find({ 'status': 1 });
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
  async listOrderDelivery(req, res, next) {
    let orders = await order.find({ 'status': 2 }).populate("accountId", "-__v").exec();
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
  async listOrderDelivered(req, res, next) {
    let orders = await order.find({ 'status': 3 }).populate("accountId", "-__v").exec();
    res.status(200).send({ message: 'Query data successfully!', data: orders });
  };
  async confirm(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests.id };
    await order.findOneAndUpdate(id, { 'status': requests.data }, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };
  async delivered(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests.id };
    await order.findOneAndUpdate(id, { 'status': requests.data }, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update delivered successfully!', data: null });
    });
  };
}

export default new OrderConfirmController;