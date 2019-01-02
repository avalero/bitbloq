import * as mongoose from 'mongoose';

import { Document, Schema, Model, model } from 'mongoose';

interface IUser extends Document{
  email?: string;
  password?: string;
  name?: string;
  center?: string;
  active?: Boolean;
  sign_up_token?: string;
  auth_token?: string;
  notifications?: Boolean;
}

export const ContactSchema: Schema = new Schema({
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
    type: String,
    default: 'aa',
  },

  authToken: {
    type: String,
    default: 'aa',
  },

  notifications: {
    type: Boolean,
  },

  created_date: {
    type: Date,
  },
});

export const UserMong: Model<IUser> = mongoose.model<IUser>(
  'UserMongs',
  ContactSchema,
);
