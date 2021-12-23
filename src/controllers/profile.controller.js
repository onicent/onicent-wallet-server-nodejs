import profile from '../models/profile.model';

class ProfileController {
  async create(req, res, next) {
    let requests = req.body;
    let profiles = new profile({
      name: requests.name,
      courseId: requests.courseId,
      description: requests.description,
      opendate: requests.opendate,
      closedate: requests.closedate
    });

    // Save user to the database
    await profiles.save((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Add new data successfully!', data: null });
    });
  };

  async read(req, res, next) {
    await profile.find((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async update(req, res, next) {
    let requests = req.body;
    let id = { '_id': requests.id };
    await profile.findOneAndUpdate(id, requests.data, { upsert: true }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await profile.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new ProfileController;