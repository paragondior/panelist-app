const cloudinary = require("cloudinary").v2;
const env = require("./env");

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

console.log("cloudinary is connected");

module.exports = cloudinary;