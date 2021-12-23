import brand from '../../../models/brand.model';

class BrandController {
  async create(req, res, next) {
    let requests = req.body;
    let brands = new brand({
      name: requests.name,
      address: requests.address,
      description: requests.description,
      phone: requests.phone,
      status: requests.status
    });

    // Save user to the database
    await brands.save((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: null });
    });
  };

  async read(req, res, next) {
    await brand.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async update(req, res, next) {
    let requests = req.body;
    console.log(requests);
    let id = { '_id': requests._id };
    let data = {
      name: requests.name,
      address: requests.address,
      description: requests.description,
      phone: requests.phone,
      status: requests.status
    };
    await brand.findOneAndUpdate(id, data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await brand.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new BrandController;