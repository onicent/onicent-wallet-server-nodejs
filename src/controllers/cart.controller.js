import cart from '../models/cart.model';
import product from '../models/product.model';

class CartController {
  async addToCart(req, res, next) {
    let requests = req.body;
    // console.log(requests);
    let carts = {
      _id: requests.productId,
      quantity: requests.quantity,
    };

    await cart.findOne({ accountId: requests.user }, { product: { $elemMatch: { _id: carts._id } } }, (err, item) => {
      if (!item.product.length > 0) {
        cart.findOneAndUpdate({ accountId: requests.user }, { $push: { product: carts } }, (err) => {
          if (err) return res.status(500).send({ message: 'error', data: err });
          res.status(200).send({ message: 'Add to cart successfully!', data: null });
        });
      } else {
        res.status(200).send({ message: 'Update to cart successfully!!', data: null });
      }
    }).exec();
  };

  async findUserCart(req, res, next) {
    console.log('cart user id' + req.body.id);
    await cart.findOne({ accountId: req.body.id }, (err, data) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      let arr = [];
      data.product.map(async (value, index) => {
        let products = await product.findOne({ '_id': value._id }).populate("roles", "-__v").exec();
        if (products) {
          let productCart = {
            idCart: data._id,
            idProduct: value._id,
            image: products.name,
            name: products.name,
            // type: products.properties[0].type,
            size: products.properties[0].size,
            color: products.properties[0].color,
            price: products.properties[0].price,
            quantity: value.quantity
          };
          arr.push(productCart);
        }
        // console.log(products);
        if (data.product.length === index + 1) {
          // console.log(arr);
          res.status(200).send({ message: 'Query Cart successfully!', data: arr });
        }
      });
    });
  };

  async remoItemToCart(req, res, next) {
    let requests = req.body;
    console.log(requests);
    await cart.findOneAndUpdate({ _id: requests.idCart }, { $pull: { product: { _id: requests.idProduct } } }, (err) => {
      if (err) return res.status(500).send({ message: 'error', data: err });
      res.status(200).send({ message: 'Remove to cart successfully!', data: null });
    });
  };
}

export default new CartController;