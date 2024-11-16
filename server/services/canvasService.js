import Canvas from "../models/canvasModel.js";

const getAllCanvases = async () => {
  return await Canvas.find();
};

const getGeneratedCanvases = async (owner) => {
  return await Canvas.find({ owner });
};

const canvasService = {
  getAllCanvases,
  getGeneratedCanvases,
};

export default canvasService;
