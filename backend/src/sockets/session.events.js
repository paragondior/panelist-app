const SESSION_EVENTS = Object.freeze({
  SPEAKER_UPDATED: "session:speaker-updated",
});

let io;

const configureSessionEvents = (socketServer) => {
  io = socketServer;
};

const emitSpeakerUpdated = (snapshot, changeType) => {
  if (!io) {
    return;
  }

  const sessionId = snapshot.session._id.toString();
  const currentSpeaker = snapshot.session.currentSpeaker || null;

  const payload = {
    sessionId,
    changeType,
    currentSpeaker,
    speakerStartedAt: snapshot.session.speakerStartedAt,
    sessionStatus: snapshot.session.status,
    panelists: snapshot.panelists,
    updatedAt: snapshot.session.updatedAt,
  };

  try {
    io.to(`session:${sessionId}`).emit(SESSION_EVENTS.SPEAKER_UPDATED, payload);
    console.log(`Broadcast ${SESSION_EVENTS.SPEAKER_UPDATED} for session ${sessionId}`);
  } catch (error) {
    console.error(`Socket broadcast failed for session ${sessionId}: ${error.message}`);
  }
};

module.exports = { SESSION_EVENTS, configureSessionEvents, emitSpeakerUpdated };