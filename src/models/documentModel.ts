import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DocumentMongSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserMong',
  },

  tittle: {
    type: String,
    trim: true,
  },

  type: {
    type: String,
    required: true,
  },

  content: {
    //type: JSON,
    type: String,
    trim: true,
  },

  description: {
    type: String,
  },

  versions: [
    {
      //content: JSON,
      type: String,
      date: Date,
      id: Number,
    },
  ],

  exercise: [
    {
      //content: JSON,
      type: String,
      date: Date,
      id: Number,
    },
  ],
});

var DocumentMong = mongoose.model('DocumentMong', DocumentMongSchema);
export { DocumentMong };
