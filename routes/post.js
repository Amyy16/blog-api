const express = require("express");
const routes = express.Router();
const {
  createPost,
  getPost,
  getPosts,
  myposts,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/post");
const { verify } = require("../middlewares/verify");

routes.post("/post", verify, createPost);
routes.get("/post", getPosts);
routes.get("/post/:id", getPost);
routes.get("/myposts", verify, myposts);
routes.put("/post/:id", verify, updatePost);
routes.delete("/post/:id", verify, deletePost);
routes.post("/likepost", verify, likePost);

module.exports = routes;
