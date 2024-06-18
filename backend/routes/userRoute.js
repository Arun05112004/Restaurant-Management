import express from "express";
import {
  getNewPassword,
  loginUser,
  postNewPassword,
  postReset,
  queryList,
  registerUser,
  sendEmailFb,
  sendQuery,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/send-email", sendEmailFb);

userRouter.post("/send-query", sendQuery);

userRouter.get("/queries", queryList);

userRouter.post("/reset", postReset);

userRouter.get("/reset/id", getNewPassword);

userRouter.post("/new-password", postNewPassword);

export default userRouter;
