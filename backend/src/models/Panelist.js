const mongoose = require("mongoose");

const panelistSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    speakingOrder: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["speaking", "next", "upcoming", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  },
);

panelistSchema.index({ session: 1, speakingOrder: 1 }, { unique: true });

module.exports = mongoose.model("Panelist", panelistSchema);