import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  documentmong: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentMong',
  },

  code: {
    type: String,
    default: '111111',
  },

  versions: [
    {
      content: JSON,
      date: Date,
      id: Number,
    },
  ],

  submission: [
    {
      nick: String,
      content: JSON,
      date: Date,
      //id: Number,
      comment: String,
    },
  ],

  expireDate: {
    expireTime: Date,
  },
});

var Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise;
export default Exercise;
