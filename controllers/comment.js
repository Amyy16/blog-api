const commentModel = require("../models/comment");
const postModel = require("../models/post");

//make a comment
//private
const makeComment = async (req, res) => {
  const { postId, comment } = req.body;
  const { id } = req.user;
  try {
    const newComment = new commentModel({
      comment,
      authorId: id,
      postId,
    });
    const savedComment = await newComment.save();
    await postModel.findByIdAndUpdate(postId, {
      $push: { comments: savedComment.id },
    });
    res.status(200).json({ message: "comment created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get a comment by commentid and postid
//private
const getComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;
    //check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    //retrieve specific comment
    const comment = await commentModel
      .findOne({ _id: commentId, postId })
      .populate({ path: "authorId", select: "username" })
      .populate({ path: "postId", select: "title content image" });
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//get all comment for a specific post
//private
const getcomments = async (req, res) => {
  try {
    const { postId } = req.query;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comments = await commentModel
      .find({ postId })
      .populate({ path: "authorId", select: "username" });
    // .populate({ path: "postId", select: "title content image" });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//update a comment
//private
const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;
    const { comment } = req.body;
    const { userid } = req.user;
    //check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    //retrieve specific comment
    const onecomment = await commentModel.findOne({ _id: commentId, postId });
    if (!onecomment) {
      return res.status(404).json({ message: "comment not found" });
    }
    //check comment author validity
    if (onecomment.authorId.toString() !== userid) {
      res.status(403).json({ msg: "you cannot edit this comment" });
    }
    //update comment
    const updatedComment = await commentModel.findOneAndUpdate(
      { _id: commentId, postId },
      comment,
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json(error.message);
  }
}; //populate user and post

//delete a comment
//private
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;
    const { userid } = req.user;
    //check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    //retrieve specific comment
    const onecomment = await commentModel.findOne({ id: commentId, postId });
    if (!onecomment) {
      return res.status(404).json({ message: "comment not found" });
    }
    //check comment author validity
    if (onecomment.authorId.toString() !== userid) {
      res.status(403).json({ msg: "you cannot edit this comment" });
    }
    //delete comment
    await commentModel.findOneAndDelete({ id: commentId, postId });
    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  makeComment,
  getComment,
  getcomments,
  updateComment,
  deleteComment,
};
