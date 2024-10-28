const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "user",
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "comment",
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
