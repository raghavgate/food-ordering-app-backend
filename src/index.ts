import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";

import { v2 as cloudinary } from "cloudinary";
import orderRoute from "./routes/OrderRoute";

//establish connection to database
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to Database")); // casting in typescript

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//create express server and assign to variable app
const app = express();
//Middleware (automatically convert any request made to api server to json)

app.use(cors());

//stripe access
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

//health endpoint, basic sanity check to see if server has started
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health ok!" });
});

app.use("/api/my/user", myUserRoute);

//endpoint for restaurant
app.use("/api/my/restaurant", myRestaurantRoute);

app.use("/api/restaurant", restaurantRoute);

app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
