import product from '../models/product.model';
// import isBase64 from 'is-base64';
// import fs from 'fs';

class ProductDetail {
  async productDetail(req, res, next) {
    await product.find({ _id: req.query.id }).exec((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };
}

export default new ProductDetail;
