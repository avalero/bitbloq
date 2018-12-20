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
    default: 'Nuevo Documento',
  },

  type: {
    type: String,
    required: true,
    default: '3D',
  },

  content: {
    type: JSON,
    trim: true,
  },

  description: {
    type: String,
  },

  versions: [
    {
      content: JSON,
      date: Date,
      id: Number,
    },
  ],

  exercise: [
    {
      content: JSON,
      date: Date,
      id: Number,
    },
  ],
});

var DocumentMong = mongoose.model('DocumentMong', DocumentMongSchema);
module.exports = DocumentMong;
export default DocumentMong;
