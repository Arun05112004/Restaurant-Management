import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://Admin:Admin@maiarun.wcmlijw.mongodb.net/?retryWrites=true&w=majority&appName=Maiarun"
    )
    .then(() => {
      console.log("DB Connected");
    });
};
