import shop from '../../../models/shop.model';

class ShopController {
  async create(req, res, next) {
    let requests = req.body;
    let shops = new shop({
      name: requests.name,
      description: requests.description,
      status: requests.status,
    });

    // Save user to the database
    await shops.save((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: null });
    });
  };

  async read(req, res, next) {
    await shop.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async update(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests._id };
    let data = {
      name: requests.name,
      description: requests.description,
      status: requests.status,
    };
    await shop.findOneAndUpdate(id, data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await shop.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new ShopController;