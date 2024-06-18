import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://bhawnaanandpctebtech20:bhawna123@cluster0.njcjzky.mongodb.net/food-del?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("DB Connected");
    });
};
