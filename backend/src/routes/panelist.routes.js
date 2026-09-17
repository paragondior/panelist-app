const express = require("express");
const panelistController = require("../controllers/panelist.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate, requireAdmin);
router.get("/", asyncHandler(panelistController.listPanelists));
router.get("/:id", asyncHandler(panelistController.getPanelist));
router.post("/", asyncHandler(panelistController.createPanelist));
router.put("/:id", asyncHandler(panelistController.updatePanelist));
router.delete("/:id", asyncHandler(panelistController.deletePanelist));

module.exports = router;