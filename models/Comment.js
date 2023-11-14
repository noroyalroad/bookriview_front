const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
