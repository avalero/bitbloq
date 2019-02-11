import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface ILogs extends Document {
  user?: string;
  object?: string;
  action?: string;
  operatingSystem?: string;
  data?: string;
}

const LogsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  object: {
    type: Schema.Types.ObjectId,
  },

  action: {
    type: String,
  },

  operatingSystem: {
    type: String,
  },

  docType: {
    type: String,
  },
});

LogsSchema.plugin(timestamps);
export const LogModel: Model<ILogs> = model<ILogs>('LogModel', LogsSchema);
