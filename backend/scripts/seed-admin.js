const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDatabase = require("../src/config/database");
const User = require("../src/models/User");

dotenv.config();

const requiredEnvironmentVariables = [
  "MONGODB_URI",
  "ADMIN_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const getEnvironmentValue = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
};

const seedAdmin = async () => {
  requiredEnvironmentVariables.forEach(getEnvironmentValue);

  const name = getEnvironmentValue("ADMIN_NAME");
  const email = getEnvironmentValue("ADMIN_EMAIL").toLowerCase();
  const password = getEnvironmentValue("ADMIN_PASSWORD");

  await connectDatabase(getEnvironmentValue("MONGODB_URI"));

  const existingAdmin = await User.exists({ email, role: "admin" });

  if (existingAdmin) {
    console.log(`Admin user already exists for ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    passwordHash,
    role: "admin",
  });

  console.log(`Admin user created for ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error(`Admin seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });