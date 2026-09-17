const express = require("express");
const sessionController = require("../controllers/session.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authenticate, requireAdmin);
router.get("/", asyncHandler(sessionController.listSessions));
router.get("/:id", asyncHandler(sessionController.getSession));
router.post("/", asyncHandler(sessionController.createSession));
router.put("/:id", asyncHandler(sessionController.updateSession));
router.delete("/:id", asyncHandler(sessionController.deleteSession));
router.put("/:id/current-speaker", asyncHandler(sessionController.selectCurrentSpeaker));
router.put("/:id/start-speaker", asyncHandler(sessionController.startSpeaker));
router.put("/:id/end-speaker", asyncHandler(sessionController.endSpeaker));
router.put("/:id/reset", asyncHandler(sessionController.resetSession));

module.exports = router;