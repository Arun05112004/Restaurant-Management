import foodModel from "../models/foodModel.js";
import mongoose from "mongoose";
import fs from "fs";

export const addFood = async (req, res, next) => {
  let image_filename = `${req.file.filename}`;
  console.log(image_filename);
  console.log("og: ", req.file);
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  console.log(food);

  try {
    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error while adding food " });
  }
};

export const foodList = async (req, res, next) => {
  try {
    console.log("in cont");
    const { page = 1, category = "All", sort = "asc" } = req.query;
    const limit = 8; // Items per page
    const skip = (page - 1) * limit;

    const query = category === "All" ? {} : { category };
    const sortOption = sort === "asc" ? { price: 1 } : { price: -1 };

    const foodList = await foodModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const totalItems = await foodModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: foodList,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch food list", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const removeFoodItem = async (req, res, next) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const foodListAll = async (req, res) => {
  try {
    const food = await foodModel.find({});
    console.log("list ", food);
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

export const editFoodItem = async (req, res) => {
  try {
    let image_filename;
    const food = await foodModel.findById(
      new mongoose.Types.ObjectId(req.body.id)
    );

    if (!food) {
      const error = new Error("Could not find Item.");
      error.statusCode = 404;
      throw error;
    }
    if (!req.file) {
      image_filename = food.image;
    } else {
      image_filename = req.file.filename;
    }
    console.log("img_filename ", image_filename);
    const foodUp = await foodModel.findOneAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
      }
    );

    console.log(foodUp);
    res.json({ success: true, message: "Saved changes successfuly" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const getSingleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    res.json({ success: true, data: food });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error" });
  }
};
