const express = require("express");
const sessionController = require("../controllers/session.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/:id/dashboard", asyncHandler(sessionController.getPublicSessionDashboard));

module.exports = router;