import supplier from '../../../models/supplier.model';

class supplierController {
  async create(req, res, next) {
    let requests = req.body;
    let suppliers = new supplier({
      name: requests.name,
      address: requests.address,
      introduction: requests.introduction,
      phone: requests.phone,
      status: requests.status
    });

    // Save user to the database
    await suppliers.save((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: null });
    });
  };

  async read(req, res, next) {
    await supplier.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async update(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests._id };
    let data = {
      name: requests.name,
      address: requests.address,
      introduction: requests.introduction,
      phone: requests.phone,
      status: requests.status
    };
    await supplier.findOneAndUpdate(id, data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await supplier.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new supplierController;