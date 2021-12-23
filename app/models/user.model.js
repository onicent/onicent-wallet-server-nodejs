import mongoose from 'mongoose';
// import validator from 'validator';
import bcrypt from 'bcryptjs';

let document = 'User';
let schema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // validate: value => {
    //   if (!validator.isEmail(value)) {
    //     throw new Error({ error: 'Invalid Email address' })
    //   }
    // }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  status: {
    type: Number,
    default: 0
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

schema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hashSync(this.password, 8);
    return next();
  } catch (err) {
    return next(err);
  }
});

let userModel = mongoose.model(document, schema);
export default userModel;
