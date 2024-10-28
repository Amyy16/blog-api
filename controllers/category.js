const categoryModel = require("../models/category");

//create a category
//private admin
const addCategory = async (req, res) => {
  const { category } = req.body;
  try {
    const newCategory = new categoryModel({ category });
    await newCategory.save();
    res.status(201).json({ message: "category created successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//get all categories
//private
const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//get a category by id
//populates the posts under or do it in post and make this route authorized
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "category does not exist" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//update a category by id
//private admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = req.body;
    const onecategory = await categoryModel.findById(id);
    if (!onecategory) {
      return res.status(404).json({ message: "category does not exist" });
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      category,
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

//delete a category
//private SuperAdmin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const onecategory = await categoryModel.findById(id);
    if (!onecategory) {
      return res.status(404).json({ message: "category does not exist" });
    }
    await categoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
