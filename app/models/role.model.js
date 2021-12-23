import mongoose from 'mongoose';
import role from '../configs/role.config.json';

let document = 'Role';
let schema = new mongoose.Schema({
  name: String
});
let roleModel = mongoose.model(document, schema);

roleModel.estimatedDocumentCount((err, count) => {
  if (!err && count === 0) {
    Object.keys(role).forEach((key) => {

      new roleModel({
        name: role[key]
      }).save(err => {
        if (err) console.log("error", err);
        console.log('Added ' + role[key] + ' to roles collection');
      });

    });
  }
});

export default roleModel;
