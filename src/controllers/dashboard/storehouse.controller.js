import product from '../../models/product.model';

class storeHouseController {
  async confirm(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests.id };
    await order.findOneAndUpdate(id, requests.data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };
}

export default new storeHouseController;