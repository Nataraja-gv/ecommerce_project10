const express = require("express");
const { userProfile } = require("../controllers/profile-controllers");
const userAuth = require("../middleware/user-auth");

const profileRouter = express.Router();

profileRouter.get("/auth/profile",userAuth,userProfile)
module.exports = profileRouter;
