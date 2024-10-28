const express = require("express");
const routes = express.Router();
const {
  makeComment,
  getComment,
  getcomments,
  updateComment,
  deleteComment,
} = require("../controllers/comment");
const { verify } = require("../middlewares/verify");

routes.post("/comment", verify, makeComment);
routes.get("/comment", verify, getComment);
routes.get("/comments", verify, getcomments);
routes.put("/comment", verify, updateComment);
routes.delete("/comment", verify, deleteComment);

module.exports = routes;
