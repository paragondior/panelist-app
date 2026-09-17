const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Only start the server after MongoDB connects
    console.log(` Backend ready on port ${PORT}`);
  })
  .catch((error) => {
    console.error(" MongoDB connection failed:");
    console.error(error.message);
  });