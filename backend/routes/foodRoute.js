import express from "express";
import {
  addFood,
  editFoodItem,
  foodList,
  foodListAll,
  getSingleFood,
  removeFoodItem,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    console.log("infood route: ", file.originalname);
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/alllist", foodListAll);
foodRouter.get("/list", foodList);
foodRouter.post("/remove", removeFoodItem);
foodRouter.post("/foodItem", getSingleFood);
foodRouter.post("/update", upload.single("image"), editFoodItem);

export default foodRouter;
