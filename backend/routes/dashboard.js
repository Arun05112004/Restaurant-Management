import express from "express";

const dashboardRouter = express.Router();
import {
  dashList,
  getPie,
  sendReply,
} from "../controllers/dashboardController.js";

dashboardRouter.get("/list", dashList);
dashboardRouter.get("/pie", getPie);
dashboardRouter.post("/send-reply", sendReply);

export default dashboardRouter;
