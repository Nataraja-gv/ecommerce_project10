const express = require("express");
require("dotenv").config();
const ConnectDB = require("./config/data-base");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth-router");
const profileRouter = require("./routers/profile-router");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);

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
