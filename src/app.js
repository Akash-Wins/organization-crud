import express from "express";
import mongoose from "mongoose";
import bodyparser from "express";
import route from "./routers/router.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("connection failed", err);
  });

route(app);
app.listen(process.env.PORT);
