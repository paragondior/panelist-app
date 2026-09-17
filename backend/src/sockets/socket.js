const mongoose = require("mongoose");
const { configureSessionEvents } = require("./session.events");

const getSessionId = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value.sessionId === "string") {
    return value.sessionId.trim();
  }

  return "";
};

const initializeSocket = (httpServer, corsOrigin) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
    },
  });

  configureSessionEvents(io);

  io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    socket.on("joinSession", (value, acknowledge) => {
      const sessionId = getSessionId(value);

      if (!mongoose.isObjectIdOrHexString(sessionId)) {
        const error = { success: false, message: "A valid session ID is required" };
        console.error(`Socket room join rejected for client ${socket.id}`);

        if (typeof acknowledge === "function") {
          acknowledge(error);
        } else {
          socket.emit("socket:error", error);
        }

        return;
      }

      const room = `session:${sessionId}`;
      socket.join(room);
      console.log(`Socket client ${socket.id} joined session room ${sessionId}`);

      if (typeof acknowledge === "function") {
        acknowledge({ success: true, sessionId });
      }
    });

    socket.on("leaveSession", (value, acknowledge) => {
      const sessionId = getSessionId(value);

      if (!mongoose.isObjectIdOrHexString(sessionId)) {
        const error = { success: false, message: "A valid session ID is required" };

        if (typeof acknowledge === "function") {
          acknowledge(error);
        } else {
          socket.emit("socket:error", error);
        }

        return;
      }

      socket.leave(`session:${sessionId}`);

      if (typeof acknowledge === "function") {
        acknowledge({ success: true, sessionId });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

module.exports = initializeSocket;