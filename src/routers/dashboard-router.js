const express = require("express");
const dashboardControllers = require("../controllers/dashboard-controllers");
const dashboardRouter = express.Router();

dashboardRouter.get("/auth/dashboard", userAuth, dashboardControllers);
module.exports = dashboardRouter;
