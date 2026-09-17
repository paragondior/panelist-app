const mongoose = require("mongoose");

const connectDatabase = async (mongodbUri) => {
  await mongoose.connect(mongodbUri);
  console.log("MongoDB connected successfully");
};

module.exports = connectDatabase;