import mongoose from 'mongoose';
import role from '../web.config.json';

let document = 'Role';
let schema = new mongoose.Schema({
  name: String
});
let roleModel = mongoose.model(document, schema);

roleModel.estimatedDocumentCount((err, count) => {
  if (!err && count === 0) {
    Object.keys(role.roles).forEach((key) => {

      new roleModel({
        name: role.roles[key]
      }).save(err => {
        if (err) console.log("error", err);
        console.log('Added ' + role.roles[key] + ' to roles collection');
      });

    });
  }
});

export default roleModel;
