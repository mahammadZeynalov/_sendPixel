import Canvas from "../models/canvasModel.js";

const getAllCanvases = async () => {
  return await Canvas.find();
};

const getGeneratedCanvases = async (owner) => {
  return await Canvas.find({ owner });
};

const getJoinedCanvases = async (walletAddress) => {
  return await Canvas.find({ pixels: walletAddress });
};

const getCanvas = async (canvasId) => {
  return await Canvas.findOne({ canvasId });
};

const canvasService = {
  getAllCanvases,
  getGeneratedCanvases,
  getJoinedCanvases,
  getCanvas,
};

export default canvasService;
