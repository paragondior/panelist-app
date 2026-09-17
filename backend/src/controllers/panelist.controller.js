const panelistService = require("../services/panelist.service");
const ApiError = require("../utils/ApiError");

const listPanelists = async (req, res) => {
  const panelists = await panelistService.listPanelists(req.query);

  res.status(200).json({
    success: true,
    data: { panelists },
  });
};

const getPanelist = async (req, res) => {
  const panelist = await panelistService.getPanelistById(req.params.id);

  res.status(200).json({
    success: true,
    data: { panelist },
  });
};

const createPanelist = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ApiError(400, "Panelist data is required");
  }

  const panelist = await panelistService.createPanelist(req.body);

  res.status(201).json({
    success: true,
    data: { panelist },
  });
};

const updatePanelist = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ApiError(400, "Panelist data is required");
  }

  const panelist = await panelistService.updatePanelist(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: { panelist },
  });
};

const deletePanelist = async (req, res) => {
  await panelistService.deletePanelist(req.params.id);

  res.status(204).send();
};

module.exports = {
  createPanelist,
  deletePanelist,
  getPanelist,
  listPanelists,
  updatePanelist,
};