const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDatabase = require("./config/database");
const env = require("./config/env");

const httpServer = http.createServer(app);

// Socket.io is attached now so later phases can add authenticated session rooms and events.
const io = new Server(httpServer, {
  cors: {
    origin: env.frontendUrl,
  },
});

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