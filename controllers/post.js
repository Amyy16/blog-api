const postModel = require("../models/post");

//create post
//private
const createPost = async (req, res) => {
  try {
    const { authorId, ...others } = req.body;
    const { id } = req.user;
    const newPost = new postModel({ ...others, authorId: id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
//get all posts
//public
const getPosts = async (req, res) => {
  try {
    const allPosts = await postModel
      .find()
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "authorId", select: "username " })
      .populate({ path: "comments", select: "comment username" });
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//get my posts
//private
const myposts = async (req, res) => {
  try {
    const { id } = req.user;
    const posts = await postModel
      .find({ authorId: id })
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "authorId", select: "username " })
      .populate({ path: "comments", select: "comment authorId" });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//get all posts under a category
//private
const categorizedposts = async (req, res) => {
  try {
    const { id } = req.params;
    // const { id } = req.user;
    const posts = await postModel
      .find({ categoryId: id })
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "authorId", select: "username " })
      .populate({ path: "comments", select: "comment authorId" });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//get a single post
//public
const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel
      .findById(id)
      .populate({ path: "categoryId", select: "category" })
      .populate({ path: "authorId", select: "username " })
      .populate({ path: "comments", select: "comment authorId" });
    if (!post) {
      return res.status(400).json({ message: "post does not exist" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: "something went wrong" });
  }
};
//updatePost
//private
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { likes, ...others } = req.body;
  const userid = req.user.id;
  //get post
  const post = await postModel.findById(id);
  if (!post) {
    return res.json({ message: "post does not exist" });
  }
  if (post.authorId.toString() !== userid) {
    res.status(403).json({ message: "you cannot edit this post" });
  }
  try {
    await postModel.findByIdAndUpdate(id, others, { new: true });
    res.status(200).json({ message: "post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//deletePost
//private
const deletePost = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  //get post
  const post = await postModel.findById(id);
  if (!post) {
    return res.json({ message: "post no longer exist" });
  }
  if (post.authorId.toString() !== userid) {
    return res.status(403).json({ message: "you cannot delete this post" });
  }
  try {
    await postModel.findByIdAndDelete(id);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//likePost
//private
const likePost = async (req, res) => {
  const { id } = req.body;
  const userid = req.user.id;
  const post = await postModel.findById(id);
  if (!post) {
    return res.status(404).json({ message: "post does not exist" });
  }
  const gottenlikes = post.likes;
  const includelikes = gottenlikes.includes(userid);
  if (!includelikes) {
    gottenlikes.push(userid);
  } else {
    const index = gottenlikes.indexOf(userid);
    gottenlikes.splice(index, 1);
  }
  try {
    await postModel.findByIdAndUpdate(
      id,
      { likes: gottenlikes },
      { new: true }
    );
    res.status(200).json({ message: "post liked" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  myposts,
  updatePost,
  deletePost,
  likePost,
};
