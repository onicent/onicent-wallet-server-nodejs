import mongoose from 'mongoose';

let document = 'Profile';
let schema = new mongoose.Schema({
  photo: String,
  fullname: String,
  dayofbirth: String,
  gender: Number,
  hometown: String,
  phone: String,
  introduction: String,
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account"
  },
  created: {
    type: Date,
    default: Date.now
  },
  udated: {
    type: Date,
    default: Date.now
  }
});

let profileModel = mongoose.model(document, schema);
export default profileModel;
