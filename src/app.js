const express = require("express");
require("dotenv").config();
const ConnectDB = require("./config/data-base");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");
const categoryRouter = require("./routers/category-router");
const productRouter = require("./routers/product-router");
const addressRouter = require("./routers/address-router");
const cartRouter = require("./routers/cart-router");
const orderRouter = require("./routers/order-router");
const razorpayRouter = require("./routers/razorpay-router");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://main.dd3cdo8ixcbq8.amplifyapp.com",
    ],
    credentials: true,
  }),
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", addressRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);
app.use("/", razorpayRouter);

const StartServer = async () => {
  try {
    await ConnectDB();
    console.log("✅ Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

StartServer();
