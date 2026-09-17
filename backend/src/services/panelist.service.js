const mongoose = require("mongoose");
const Panelist = require("../models/Panelist");
const Session = require("../models/Session");
const ApiError = require("../utils/ApiError");

const panelistFields = [
  "session",
  "fullName",
  "profileImage",
  "role",
  "company",
  "location",
  "email",
  "topic",
  "bio",
  "linkedIn",
  "speakingOrder",
  "status",
];

const getPanelistInput = (body) =>
  panelistFields.reduce((input, field) => {
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

const assertSessionExists = async (sessionId) => {
  assertObjectId(sessionId, "session");

  const sessionExists = await Session.exists({ _id: sessionId });

  if (!sessionExists) {
    throw new ApiError(404, "Session not found");
  }
};

const handleDatabaseError = (error) => {
  if (error?.code === 11000) {
    throw new ApiError(409, "Speaking order must be unique within a session");
  }

  if (error?.name === "ValidationError") {
    throw new ApiError(400, "Panelist data is invalid");
  }

  throw error;
};

const listPanelists = async (filters = {}) => {
  const query = {};

  if (filters.session) {
    assertObjectId(filters.session, "session");
    query.session = filters.session;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return Panelist.find(query).sort({ speakingOrder: 1, createdAt: 1 });
};

const getPanelistById = async (panelistId) => {
  assertObjectId(panelistId, "panelist ID");

  const panelist = await Panelist.findById(panelistId);

  if (!panelist) {
    throw new ApiError(404, "Panelist not found");
  }

  return panelist;
};

const createPanelist = async (body) => {
  const input = getPanelistInput(body);

  await assertSessionExists(input.session);

  try {
    return await Panelist.create(input);
  } catch (error) {
    handleDatabaseError(error);
  }
};

const updatePanelist = async (panelistId, body) => {
  const input = getPanelistInput(body);

  await getPanelistById(panelistId);

  if (input.session !== undefined) {
    await assertSessionExists(input.session);
  }

  try {
    const panelist = await Panelist.findByIdAndUpdate(panelistId, input, {
      new: true,
      runValidators: true,
    });

    return panelist;
  } catch (error) {
    handleDatabaseError(error);
  }
};

const deletePanelist = async (panelistId) => {
  await getPanelistById(panelistId);
  await Panelist.findByIdAndDelete(panelistId);
};

module.exports = {
  createPanelist,
  deletePanelist,
  getPanelistById,
  listPanelists,
  updatePanelist,
};