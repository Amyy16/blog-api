const express = require("express");
const routes = express.Router();
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { verify } = require("../middlewares/verify");

routes.post("/", verify, addCategory);
routes.get("/:id", verify, getCategory);
routes.get("/", verify, getCategories);
routes.put("/:id", verify, updateCategory);
routes.delete("/:id", verify, deleteCategory);

module.exports = routes;
