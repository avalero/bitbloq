import * as mongoose from 'mongoose';
import { Int32 } from 'bson';

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  id: Schema.Types.ObjectId,

  email: {
    type: String,
    unique: true,
    required: 'Please enter your email',
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    trim: true,
  },

  center: {
    type: String,
    trim: true,
  },

  active: {
    type: Boolean,
  },

  signUpToken: {
    type: Number,
  },

  authToken: {
    type: Number,
  },

  notifications: {
    type: Boolean,
  },

  created_date: {
    type: Date,
  },
});


var UserMong = mongoose.model('UserMongs', ContactSchema);
//module.exports = UserMong;
export {UserMong};
