import category from '../../../models/category.model';

class CategoryController {
  async create(req, res, next) {
    let requests = req.body;
    let categories = new category({
      name: requests.name,
      description: requests.description,
      status: requests.status
    });

    // Save user to the database
    await categories.save((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: null });
    });
  };

  async read(req, res, next) {
    await category.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async categories(req, res, next) {
    await category.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      let categorys = data.reduce((categorys, cate) => {
        if (cate.status === 1) {
          categorys.push(cate);
        }
        return categorys;
      }, []);
      res.status(200).send({ message: 'Query data successfully!', data: categorys });
    });
  };

  async update(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests._id };
    let data = {
      name: requests.name,
      description: requests.description,
      status: requests.status
    };
    await category.findOneAndUpdate(id, data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await category.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new CategoryController;