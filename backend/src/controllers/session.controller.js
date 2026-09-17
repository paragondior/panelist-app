const sessionService = require("../services/session.service");
const ApiError = require("../utils/ApiError");

const requireBody = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Request data is required");
  }
};

const listSessions = async (req, res) => {
  const sessions = await sessionService.listSessions(req.query);
  res.status(200).json({ success: true, data: { sessions } });
};

const getSession = async (req, res) => {
  const data = await sessionService.getSessionDetails(req.params.id);
  res.status(200).json({ success: true, data });
};

const createSession = async (req, res) => {
  requireBody(req.body);
  const session = await sessionService.createSession(req.body, req.auth.userId);
  res.status(201).json({ success: true, data: { session } });
};

const updateSession = async (req, res) => {
  requireBody(req.body);
  const session = await sessionService.updateSession(req.params.id, req.body);
  res.status(200).json({ success: true, data: { session } });
};

const deleteSession = async (req, res) => {
  await sessionService.deleteSession(req.params.id);
  res.status(204).send();
};

const getPanelistId = (req) => {
  const panelistId = req.body?.panelistId;
  if (typeof panelistId !== "string" || !panelistId.trim()) {
    throw new ApiError(400, "panelistId is required");
  }
  return panelistId;
};

const selectCurrentSpeaker = async (req, res) => {
  const snapshot = await sessionService.selectCurrentSpeaker(req.params.id, getPanelistId(req));
  res.status(200).json({ success: true, data: snapshot });
};

const startSpeaker = async (req, res) => {
  const snapshot = await sessionService.startSpeaker(req.params.id, getPanelistId(req));
  res.status(200).json({ success: true, data: snapshot });
};

const endSpeaker = async (req, res) => {
  const snapshot = await sessionService.endSpeaker(req.params.id);
  res.status(200).json({ success: true, data: snapshot });
};

const resetSession = async (req, res) => {
  const snapshot = await sessionService.resetSession(req.params.id);
  res.status(200).json({ success: true, data: snapshot });
};

module.exports = {
  createSession,
  deleteSession,
  endSpeaker,
  getSession,
  listSessions,
  resetSession,
  selectCurrentSpeaker,
  startSpeaker,
  updateSession,
};