const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    imgPath: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
module.exports = { Board };
