import Canvas from "../models/canvasModel.js";

const getAllCanvases = async () => {
  return await Canvas.find();
};

const canvasService = {
  getAllCanvases,
};

export default canvasService;
