const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    sessionName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "live", "completed"],
      default: "draft",
    },
    currentSpeaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panelist",
      default: null,
    },
    speakerStartedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ status: 1, scheduledAt: 1 });
sessionSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Session", sessionSchema);