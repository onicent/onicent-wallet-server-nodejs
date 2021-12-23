import product from '../models/product.model';
// import isBase64 from 'is-base64';
// import fs from 'fs';

class GetProductController {
  async getProduct(req, res, next) {
    console.log(req.body);
    await product.find({ categoryId: req.body.id }).populate("roles", "-__v").exec((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };
}

export default new GetProductController;
