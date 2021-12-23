import product from '../../models/product.model';
import isBase64 from 'is-base64';
import fs from 'fs';

class ProductController {
  async create(req, res, next) {
    let requests = req.body;
    let data = {
      name: requests.name,
      // image: '',  
      properties: [
        {
          color: requests.color,
          price: parseInt(requests.price),
          size: '',
          quantity: parseInt(requests.quantity),
        }
      ],
      description: requests.description,
      rate: parseInt(requests.rate),
      // staffId: requests.staffId ,
      supplierId: requests.supplierId,
      categoryId: requests.categoryId,
      // groupItemId: requests.groupItemId,
      shopId: requests.shopId,
      brandId: requests.brandId,
      status: requests.status || 0
    };
    console.log(data);
    // Save user to the database

    let products = await product.create(data);
    let dir = './src/public/storage/products/' + products._id + '/';
    let nameImage = products.name + '.' + 'jpeg';
    let storageImage = dir + nameImage;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(storageImage, requests.image.split(',')[1], 'base64', function (err) {
      if (err) return console.error(err);
      console.log('file saved to ');
    });

    res.status(200).send({ message: 'Add new data successfully!', data: null });

  };

  async read(req, res, next) {
    await product.find().populate("roles", "-__v").exec((err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Query data successfully!', data: data });
    });
  };

  async update(req, res, next) {
    console.log(req.body.image);
    let requests = req.body.data;
    let id = { '_id': req.body.id };
    let dataUpdate = {
      name: requests.name,
      // image: '',  
      properties: [
        {
          color: requests.color,
          price: parseInt(requests.price),
          size: '',
          quantity: parseInt(requests.quantity),
        }
      ],
      description: requests.description,
      rate: parseInt(requests.rate),
      // staffId: requests.staffId ,
      supplierId: requests.supplierId,
      categoryId: requests.categoryId,
      // groupItemId: requests.groupItemId,
      shopId: requests.shopId,
      brandId: requests.brandId,
      status: requests.status || 0
    };

    await product.findOneAndUpdate(id, dataUpdate, { upsert: true }, (err, products) => {
      if (err) return res.status(500).send({ message: 'error', data: err });

      if (isBase64(req.body.image.split(',')[1])) {
        let image = './src/public/storage/products/' + products._id + '/' + products.name + '.' + 'jpeg';
        fs.writeFile(image, req.body.image.split(',')[1], 'base64', function (err) {
          if (err) return console.error(err);
          console.log('Update successfully!');
        });
      }

      res.status(200).send({ message: 'Update new data successfully!', data: null });
    });
  };

  async delete(req, res, next) {
    let requests = req.body;
    await product.deleteOne({ _id: requests.id }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      let dir = './src/public/storage/products/' + requests.id;
      fs.rmdirSync(dir, { recursive: true });
      res.status(200).send({ message: 'Delete successfully!', data: null });
    });
  };
}

export default new ProductController;
