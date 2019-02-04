import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  user: {
    id: Schema.Types.ObjectId,
    ref: "User",
  },

  action: {
    type: JSON,
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  data: {
    type: JSON,
  },
});

const Logs = mongoose.model("Logs", LogsSchema);
module.exports = Logs;
export default Logs;
