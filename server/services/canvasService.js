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

const canvasService = {
  getAllCanvases,
  getGeneratedCanvases,
  getJoinedCanvases,
};

export default canvasService;
