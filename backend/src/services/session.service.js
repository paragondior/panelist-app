const mongoose = require("mongoose");
const Panelist = require("../models/Panelist");
const Session = require("../models/Session");
const ApiError = require("../utils/ApiError");
const { emitSpeakerUpdated } = require("../sockets/session.events");

const sessionFields = [
  "eventName",
  "sessionName",
  "description",
  "scheduledAt",
  "status",
];

const getSessionInput = (body) =>
  sessionFields.reduce((input, field) => {
    if (body[field] !== undefined) {
      input[field] = body[field];
    }

    return input;
  }, {});

const assertObjectId = (value, fieldName) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new ApiError(400, `${fieldName} must be a valid ID`);
  }
};

const getSessionById = async (sessionId, options = {}) => {
  assertObjectId(sessionId, "session ID");

  const query = Session.findById(sessionId).populate("currentSpeaker");

  if (options.session) {
    query.session(options.session);
  }

  const session = await query;

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  return session;
};

const getSessionSnapshot = async (sessionId, dbSession) => {
  const session = await Session.findById(sessionId).populate("currentSpeaker").session(dbSession);

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  const panelists = await Panelist.find({ session: sessionId })
    .sort({ speakingOrder: 1, createdAt: 1 })
    .session(dbSession);

  return { session, panelists };
};

const getSessionDetails = async (sessionId) => getSessionSnapshot(sessionId);

const getPublicSessionDashboard = async (sessionId) => {
  const snapshot = await getSessionSnapshot(sessionId);
  const session = snapshot.session.toObject();

  delete session.createdBy;

  return {
    session,
    panelists: snapshot.panelists,
  };
};

const withTransaction = async (callback) => {
  const dbSession = await mongoose.startSession();

  try {
    let result;
    await dbSession.withTransaction(async () => {
      result = await callback(dbSession);
    });
    return result;
  } finally {
    await dbSession.endSession();
  }
};

const handleDatabaseError = (error) => {
  if (error?.code === 11000) {
    throw new ApiError(409, "A panelist already uses that speaking order in this session");
  }

  if (error?.name === "ValidationError" || error?.name === "CastError") {
    throw new ApiError(400, "Session data is invalid");
  }

  throw error;
};

const listSessions = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  return Session.find(query)
    .populate("currentSpeaker")
    .populate("createdBy", "name email role")
    .sort({ scheduledAt: 1, createdAt: 1 });
};

const createSession = async (body, userId) => {
  assertObjectId(userId, "user ID");

  try {
    const session = await Session.create({
      ...getSessionInput(body),
      createdBy: userId,
    });

    return getSessionById(session._id);
  } catch (error) {
    handleDatabaseError(error);
  }
};

const updateSession = async (sessionId, body) => {
  assertObjectId(sessionId, "session ID");

  try {
    const session = await Session.findByIdAndUpdate(sessionId, getSessionInput(body), {
      new: true,
      runValidators: true,
    });

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    return getSessionById(session._id);
  } catch (error) {
    handleDatabaseError(error);
  }
};

const deleteSession = async (sessionId) => {
  return withTransaction(async (dbSession) => {
    assertObjectId(sessionId, "session ID");

    const session = await Session.findById(sessionId).session(dbSession);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    await Panelist.deleteMany({ session: sessionId }).session(dbSession);
    await Session.deleteOne({ _id: sessionId }).session(dbSession);
  });
};

const getPanelistForSession = async (sessionId, panelistId, dbSession) => {
  assertObjectId(panelistId, "panelist ID");

  const panelist = await Panelist.findOne({ _id: panelistId, session: sessionId }).session(dbSession);

  if (!panelist) {
    throw new ApiError(404, "Panelist not found in this session");
  }

  return panelist;
};

const selectCurrentSpeaker = async (sessionId, panelistId) =>
  withTransaction(async (dbSession) => {
    const session = await Session.findById(sessionId).session(dbSession);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    const panelist = await getPanelistForSession(sessionId, panelistId, dbSession);

    await Panelist.updateMany(
      { session: sessionId, _id: { $ne: panelist._id }, status: "speaking" },
      { $set: { status: "upcoming" } },
      { session: dbSession },
    );
    panelist.status = "next";
    await panelist.save({ session: dbSession });

    session.currentSpeaker = panelist._id;
    session.speakerStartedAt = null;
    await session.save({ session: dbSession });

    return getSessionSnapshot(sessionId, dbSession);
  }).then((snapshot) => {
    emitSpeakerUpdated(snapshot, "current-speaker-selected");
    return snapshot;
  });

const startSpeaker = async (sessionId, panelistId) =>
  withTransaction(async (dbSession) => {
    const session = await Session.findById(sessionId).session(dbSession);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    const panelist = await getPanelistForSession(sessionId, panelistId, dbSession);

    await Panelist.updateMany(
      { session: sessionId, _id: { $ne: panelist._id }, status: "speaking" },
      { $set: { status: "completed" } },
      { session: dbSession },
    );
    panelist.status = "speaking";
    await panelist.save({ session: dbSession });

    session.currentSpeaker = panelist._id;
    session.speakerStartedAt = new Date();
    session.status = "live";
    await session.save({ session: dbSession });

    return getSessionSnapshot(sessionId, dbSession);
  }).then((snapshot) => {
    emitSpeakerUpdated(snapshot, "speaker-started");
    return snapshot;
  });

const endSpeaker = async (sessionId) =>
  withTransaction(async (dbSession) => {
    const session = await Session.findById(sessionId).session(dbSession);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    if (!session.currentSpeaker) {
      throw new ApiError(409, "There is no current speaker");
    }

    await Panelist.updateOne(
      { _id: session.currentSpeaker, session: sessionId },
      { $set: { status: "completed" } },
      { session: dbSession },
    );
    session.currentSpeaker = null;
    session.speakerStartedAt = null;
    await session.save({ session: dbSession });

    return getSessionSnapshot(sessionId, dbSession);
  }).then((snapshot) => {
    emitSpeakerUpdated(snapshot, "speaker-ended");
    return snapshot;
  });

const resetSession = async (sessionId) =>
  withTransaction(async (dbSession) => {
    const session = await Session.findById(sessionId).session(dbSession);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    await Panelist.updateMany(
      { session: sessionId },
      { $set: { status: "upcoming" } },
      { session: dbSession },
    );
    session.currentSpeaker = null;
    session.speakerStartedAt = null;
    session.status = "draft";
    await session.save({ session: dbSession });

    return getSessionSnapshot(sessionId, dbSession);
  }).then((snapshot) => {
    emitSpeakerUpdated(snapshot, "session-reset");
    return snapshot;
  });

module.exports = {
  createSession,
  deleteSession,
  endSpeaker,
  getSessionById,
  getSessionDetails,
  getPublicSessionDashboard,
  listSessions,
  resetSession,
  selectCurrentSpeaker,
  startSpeaker,
  updateSession,
};