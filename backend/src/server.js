const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database");
const env = require("./config/env");
const initializeSocket = require("./sockets/socket");

const httpServer = http.createServer(app);
const io = initializeSocket(httpServer, env.frontendUrl);

const startServer = async () => {
  try {
    await connectDatabase(env.mongodbUri);

    httpServer.listen(env.port, () => {
      console.log(`Backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully`);
  io.close();
  httpServer.close();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));